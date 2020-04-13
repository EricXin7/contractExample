package market

import (
	"blockchain/smcsdk/sdk/bn"
	"blockchain/smcsdk/sdk/types"
)

type Goods struct {
	Name      string    `json:"name"`
	Code      string    `json:"code"`
	Price     bn.Number `json:"price"`
	BCBPrice  bn.Number `json:"bcb_price"`
	Repertory int64     `json:"repertory"`
}

type Record struct {
	ID         int64         `json:"id"`
	Time       string        `json:"time"`
	Address    types.Address `json:"address"`
	GoodsCode  string        `json:"goodsCode"`
	GoodsPrice bn.Number     `json:"goodsPrice"`
	BuyNum     int64         `json:"buyNum"`
	Used       bn.Number     `json:"used"`
	Token      string        `json:"token"`
}
