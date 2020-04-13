package TokenSale

import (
	"blockchain/smcsdk/sdk/bn"
	"blockchain/smcsdk/sdk/types"
)

const (
	layout = "2006-01-02 15:04:05"
)

type Round struct {
	FundingGoal bn.Number     `json:"fundingGoal"`
	StartDate   string        `json:"startDate"`
	EndDate     string        `json:"endDate"`
	Price       bn.Number     `json:"exchangeRate"`
	SoftCap     bn.Number     `json:"soft"`
	HardCap     bn.Number     `json:"hard"`
	FunAmount   bn.Number     `json:"funAmount"`
	Token       types.Address `json:"token"`
	Status      string        `json:"status"`
}

type Record struct {
	Address   types.Address `json:"address"`
	Spend     bn.Number     `json:"spend"`
	FunAmount bn.Number     `json:"funAmount"`
	Time      string        `json:"time"`
}
