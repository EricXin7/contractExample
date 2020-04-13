package market

import (
	"blockchain/smcsdk/sdk"
	"blockchain/smcsdk/sdk/bn"
	"blockchain/smcsdk/sdk/forx"
	"blockchain/smcsdk/sdk/types"
)

//Market This is struct of contract
//@:contract:market
//@:version:1.2
//@:organization:org9ib7PkkqhjV1A3hMXVgPcoBoxkL3iKdnS
//@:author:f17f4ec511214e5be325c407e18871d3107876978090d9721a4e69978274890b
type Market struct {
	sdk sdk.ISmartContract
}

//InitChain Constructor of this Market
//@:constructor
func (m *Market) InitChain() {
	//This method is automatically selected when the block height reaches the contract effective block height.

}

//UpdateChain Constructor of this Market
//@:constructor
func (m *Market) UpdateChain() {
	m.Reset()
	//This method is automatically selected when the block height reaches the new version contract effective block height.
}

//SampleMethod This is a sample method
//@:public:method:gas[500]
func (m *Market) Buy(code string) {
	ttm := m.sdk.Message().GetTransferToMe()
	transferToken := ttm[0].Token

	sdk.Require(len(ttm) == 1, types.ErrInvalidParameter,
		"must transfer first")

	sdk.Require(ttm[0].To == m.sdk.Message().Contract().Account().Address(), types.ErrInvalidParameter,
		"transfer must to me")

	sdk.Require(ttm[0].Value.IsGEI(0), types.ErrInvalidParameter,
		"transfer value must great than zero")

	token := m.sdk.Helper().TokenHelper().TokenOfAddress(transferToken).Name()
	sdk.Require(token == m.sdk.Helper().GenesisHelper().Token().Name() ||
		token == "demo", types.ErrInvalidParameter,
		"transfer token error")

	var g *Goods
	var i int
	gs := *m._goods()
	forx.Range(gs, func(index int, goods Goods) bool {
		if goods.Code == code {
			g = &goods
			i = index
		}
		return true
	})
	sdk.Require(g != nil, types.ErrInvalidParameter,
		"invalid goods code")

	price := g.Price
	if transferToken == m.sdk.Helper().GenesisHelper().Token().Address() {
		price = g.BCBPrice
	}

	count := ttm[0].Value.Div(price)
	sdk.Require(ttm[0].Value.Mod(price).IsZero(), types.ErrInvalidParameter,
		"transfer value mod price must is zero")

	sdk.Require(g.Repertory >= count.V.Int64(), types.ErrInvalidParameter,
		"repertory not enough")

	g.Repertory -= count.V.Int64()
	gs[i] = *g
	m._setGoods(gs)

	rs := *m._records(m.sdk.Message().Sender().Address())
	rs = append(rs, Record{
		ID:         int64(len(rs) + 1),
		Time:       m.sdk.Helper().BlockChainHelper().FormatTime(m.sdk.Block().Time(), "2006-01-02 15:04:05"),
		Address:    m.sdk.Message().Sender().Address(),
		GoodsCode:  g.Code,
		GoodsPrice: price,
		BuyNum:     count.V.Int64(),
		Used:       ttm[0].Value,
		Token:      transferToken,
	})
	m._setRecords(m.sdk.Message().Sender().Address(), rs)
}

//SampleMethod This is a sample method
//@:public:method:gas[500]
func (m *Market) Reset() {

	g1 := Goods{
		Name:      "商品1",
		Code:      "1",
		Price:     bn.N(250000000),
		BCBPrice:  bn.N(125000000),
		Repertory: 20,
	}

	g2 := Goods{
		Name:      "商品2",
		Code:      "2",
		Price:     bn.N(50000000),
		BCBPrice:  bn.N(25000000),
		Repertory: 25,
	}

	g3 := Goods{
		Name:      "商品3",
		Code:      "3",
		Price:     bn.N(140000000),
		BCBPrice:  bn.N(70000000),
		Repertory: 5,
	}

	g4 := Goods{
		Name:      "商品4",
		Code:      "4",
		Price:     bn.N(220000000),
		BCBPrice:  bn.N(110000000),
		Repertory: 0,
	}

	g5 := Goods{
		Name:      "商品5",
		Code:      "5",
		Price:     bn.N(220000000),
		BCBPrice:  bn.N(110000000),
		Repertory: 30,
	}

	gs := []Goods{g1, g2, g3, g4, g5}
	m._setGoods(gs)
}
