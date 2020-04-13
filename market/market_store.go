package market

import "blockchain/smcsdk/sdk/types"

func (m *Market) _goods() *[]Goods {
	return m.sdk.Helper().StateHelper().GetEx("/goods", new([]Goods)).(*[]Goods)
}

func (m *Market) _chkGoods() bool {
	return m.sdk.Helper().StateHelper().Check("/goods")
}

func (m *Market) _setGoods(v []Goods) {
	m.sdk.Helper().StateHelper().Set("/goods", &v)
}

func (m *Market) _delGoods() {
	m.sdk.Helper().StateHelper().Delete("/goods")
}

func (m *Market) _records(k types.Address) *[]Record {
	return m.sdk.Helper().StateHelper().GetEx("/records/"+k, new([]Record)).(*[]Record)
}

func (m *Market) _chkRecords(k types.Address) bool {
	return m.sdk.Helper().StateHelper().Check("/records/" + k)
}

func (m *Market) _setRecords(k types.Address, v []Record) {
	m.sdk.Helper().StateHelper().Set("/records/"+k, &v)
}

func (m *Market) _delRecords(k types.Address) {
	m.sdk.Helper().StateHelper().Delete("/records/" + k)
}
