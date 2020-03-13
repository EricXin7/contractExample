package ico

import "blockchain/smcsdk/sdk/types"

func (i *Ico) _round() *Round {
	return i.sdk.Helper().StateHelper().GetEx("/round", new(Round)).(*Round)
}

func (i *Ico) _chkRound() bool {
	return i.sdk.Helper().StateHelper().Check("/round")
}

func (i *Ico) _setRound(v Round) {
	i.sdk.Helper().StateHelper().Set("/round", &v)
}

func (i *Ico) _delRound() {
	i.sdk.Helper().StateHelper().Delete("/round")
}

func (i *Ico) _records(k types.Address) *[]Record {
	return i.sdk.Helper().StateHelper().GetEx("/records/"+k, new([]Record)).(*[]Record)
}

func (i *Ico) _chkRecords(k types.Address) bool {
	return i.sdk.Helper().StateHelper().Check("/records/" + k)
}

func (i *Ico) _setRecords(k types.Address, v []Record) {
	i.sdk.Helper().StateHelper().Set("/records/"+k, &v)
}

func (i *Ico) _delRecords(k types.Address) {
	i.sdk.Helper().StateHelper().Delete("/records/" + k)
}
