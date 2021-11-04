export const feeDenom = 'uaxl'

export const denomContract = (denom, denoms) => denoms?.find(_denom => _denom.denom === denom || _denom.contract === denom)?.contract || denom

export const denomSymbol = (denom, denoms) => denoms?.find(_denom => _denom.denom === denom || _denom.contract === denom)?.symbol || denom

export const denomName = (denom, denoms) => denoms?.find(_denom => _denom.denom === denom || _denom.contract === denom)?.name || denom

export const denomImage = (denom, denoms) => denoms?.find(_denom => _denom.denom === denom || _denom.contract === denom)?.image

export const denomAmount = (amount, denom, denoms) => Number(amount) / (denoms?.find(_denom => _denom.denom === denom || _denom.contract === denom)?.divider || 1)