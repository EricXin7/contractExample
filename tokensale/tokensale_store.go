package TokenSale

import "blockchain/smcsdk/sdk/types"

func (ts *TokenSale) _round() *Round {
	return ts.sdk.Helper().StateHelper().GetEx("/round", new(Round)).(*Round)
}

func (ts *TokenSale) _chkRound() bool {
	return ts.sdk.Helper().StateHelper().Check("/round")
}

func (ts *TokenSale) _setRound(v Round) {
	ts.sdk.Helper().StateHelper().Set("/round", &v)
}

func (ts *TokenSale) _delRound() {
	ts.sdk.Helper().StateHelper().Delete("/round")
}

func (ts *TokenSale) _records(k types.Address) *[]Record {
	return ts.sdk.Helper().StateHelper().GetEx("/records/"+k, new([]Record)).(*[]Record)
}

func (ts *TokenSale) _chkRecords(k types.Address) bool {
	return ts.sdk.Helper().StateHelper().Check("/records/" + k)
}

func (ts *TokenSale) _setRecords(k types.Address, v []Record) {
	ts.sdk.Helper().StateHelper().Set("/records/"+k, &v)
}

func (ts *TokenSale) _delRecords(k types.Address) {
	ts.sdk.Helper().StateHelper().Delete("/records/" + k)
}
