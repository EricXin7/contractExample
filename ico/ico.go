package ico

import (
	"blockchain/smcsdk/sdk"
	"blockchain/smcsdk/sdk/forx"
	"blockchain/smcsdk/sdk/jsoniter"
	"blockchain/smcsdk/sdk/types"
	"fmt"
)

//Ico This is struct of contract
//@:contract:ico
//@:version:1.0
//@:organization:org9ib7PkkqhjV1A3hMXVgPcoBoxkL3iKdnS
//@:author:f17f4ec511214e5be325c407e18871d3107876978090d9721a4e69978274890b
type Ico struct {
	sdk sdk.ISmartContract
}

//InitChain Constructor of this Ico
//@:constructor
func (i *Ico) InitChain() {
	//TODO
	//This method is automatically selected when the block height reaches the contract effective block height.
}

//UpdateChain Constructor of this Ico
//@:constructor
func (i *Ico) UpdateChain() {
	//TODO
	//This method is automatically selected when the block height reaches the new version contract effective block height.
}

//SampleMethod This is a sample method
//@:public:method:gas[500]
func (i *Ico) StartRound(round string) {
	var r Round
	err := jsoniter.Unmarshal([]byte(round), &r)
	sdk.RequireNotError(err, types.ErrInvalidParameter)

	sdk.RequireOwner()

	transferToMe := i.sdk.Message().GetTransferToMe()
	sdk.Require(len(transferToMe) == 1 && transferToMe[0].To == i.sdk.Message().Contract().Account().Address(), types.ErrInvalidParameter,
		"must transfer token to contract")

	sdk.Require(transferToMe[0].Value.IsGE(r.FundingGoal), types.ErrInvalidParameter,
		"transfer amount must great or equal Funding goal")

	startSec, err := i.sdk.Helper().BlockChainHelper().ParseTime(layout, r.StartDate)
	sdk.RequireNotError(err, types.ErrInvalidParameter)

	endSec, err := i.sdk.Helper().BlockChainHelper().ParseTime(layout, r.EndDate)
	sdk.RequireNotError(err, types.ErrInvalidParameter)

	sdk.Require(endSec > i.sdk.Block().Time(), types.ErrInvalidParameter,
		"endDate must great than now time")

	sdk.Require(endSec > startSec, types.ErrInvalidParameter,
		"endDate must great than startDate")

	sdk.Require(r.Price.IsGreaterThanI(0), types.ErrInvalidParameter,
		"price must great than zero")

	sdk.Require(!r.HardCap.IsZero() && r.HardCap.IsGreaterThan(r.SoftCap), types.ErrInvalidParameter,
		"hardCap cannot be zero and must great than softCap")

	sdk.Require(r.FunAmount.IsZero(), types.ErrInvalidParameter,
		"fund amount must be zero")

	r.Token = transferToMe[0].Token
	i._setRound(r)
}

//@:public:method:gas[500]
func (i *Ico) Exchange() {
	transferToMe := i.sdk.Message().GetTransferToMe()
	sdk.Require(len(transferToMe) == 1, types.ErrInvalidParameter,
		"invalid transfer")

	transferReceipt := transferToMe[0]
	sdk.Require(transferReceipt.Token == i.sdk.Helper().GenesisHelper().Token().Address(), types.ErrInvalidParameter,
		fmt.Sprintf("expected token(%s), obtain token(%s)", i._round().Token, transferReceipt.Token))

	sdk.Require(transferReceipt.To == i.sdk.Message().Contract().Account().Address(), types.ErrInvalidParameter,
		"transfer must to me")

	sdk.Require(transferReceipt.Value.IsGreaterThanI(0), types.ErrInvalidParameter,
		"transfer value must great than zero")

	var roundStart, roundEnd int64
	roundStart, _ = i.sdk.Helper().BlockChainHelper().ParseTime(layout, i._round().StartDate)
	roundEnd, _ = i.sdk.Helper().BlockChainHelper().ParseTime(layout, i._round().EndDate)

	sdk.Require(i.sdk.Block().Time() > roundStart, types.ErrInvalidParameter,
		"the ico is never start")

	sdk.Require(i.sdk.Block().Time() < roundEnd, types.ErrInvalidParameter,
		"the ico had ended")

	funAmount := transferReceipt.Value.MulI(1e9).Div(i._round().Price)
	r := Record{
		Address:   transferReceipt.From,
		Spend:     transferReceipt.Value,
		FunAmount: funAmount,
		Time:      i.sdk.Helper().BlockChainHelper().FormatTime(i.sdk.Block().Time(), layout),
	}
	i._setRecords(r.Address, append(*i._records(r.Address), r))

	round := i._round()
	round.FunAmount = round.FunAmount.Add(funAmount)
	i._setRound(*round)
}

//@:public:method:gas[500]
func (i *Ico) Withdraw() {
	r := i._round()
	var rStart, rEnd int64
	rStart, _ = i.sdk.Helper().BlockChainHelper().ParseTime(layout, r.StartDate)
	rEnd, _ = i.sdk.Helper().BlockChainHelper().ParseTime(layout, r.EndDate)

	sdk.Require(i.sdk.Block().Time() > rStart, types.ErrInvalidParameter,
		"round never start")

	sender := i.sdk.Message().Sender().Address()
	owner := i.sdk.Message().Contract().Owner().Address()
	conAccount := i.sdk.Message().Contract().Account()
	geneToken := i.sdk.Helper().GenesisHelper().Token().Address()
	if (rEnd <= i.sdk.Block().Time() && r.FunAmount.IsGE(r.SoftCap)) || r.FunAmount.IsGE(r.HardCap) {
		if sender == owner && r.Status != "finish" {
			conAccount.TransferByToken(geneToken, owner, r.FunAmount.Mul(r.Price).DivI(1e9))
			r.Status = "finish"
			i._setRound(*r)
		} else {
			forx.Range(*i._records(sender), func(index int, item Record) bool {
				conAccount.TransferByToken(r.Token, sender, item.FunAmount)
				return true
			})
			i._delRecords(sender)
		}
	} else if i.sdk.Block().Time() > rEnd {
		if sender == owner && r.Status != "finish" {
			conAccount.TransferByToken(r.Token, owner, conAccount.Balance())
			r.Status = "finish"
			i._setRound(*r)
		} else {
			forx.Range(*i._records(sender), func(index int, item Record) bool {
				conAccount.TransferByToken(geneToken, sender, item.FunAmount.Mul(r.Price).DivI(1e9))
				return true
			})
			i._delRecords(sender)
		}
	} else {
		sdk.Require(false, types.ErrInvalidParameter, "invalid require")
	}
}

//@:public:method:gas[500]
func (i *Ico) CheckGoadReached() bool {
	r := i._round()
	var rStart, rEnd int64
	rStart, _ = i.sdk.Helper().BlockChainHelper().ParseTime(layout, r.StartDate)
	rEnd, _ = i.sdk.Helper().BlockChainHelper().ParseTime(layout, r.EndDate)

	if (i.sdk.Block().Time() > rStart && r.FunAmount.IsGE(r.HardCap)) ||
		(i.sdk.Block().Time() >= rEnd && r.FunAmount.IsGE(r.SoftCap)) {
		return true
	}

	return false
}
