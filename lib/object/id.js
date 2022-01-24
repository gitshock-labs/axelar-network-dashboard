export const type = id => {
  const hashRegEx = new RegExp(/[0-9A-F]{64}$/, 'igm')
  const validatorRegEx = new RegExp(`${process.env.NEXT_PUBLIC_PREFIX_VALIDATOR}.*$`, 'igm')
  const accountRegEx = new RegExp(`${process.env.NEXT_PUBLIC_PREFIX_ACCOUNT}.*$`, 'igm')
  const accountATOMRegEx = new RegExp(`${process.env.NEXT_PUBLIC_PREFIX_ACCOUNT.replace('axelar', 'cosmos')}.*$`, 'igm')
  const accountTerraRegEx = new RegExp(`${process.env.NEXT_PUBLIC_PREFIX_ACCOUNT.replace('axelar', 'terra')}.*$`, 'igm')

  return !id ? null : !isNaN(id) ? 'block' : id.match(validatorRegEx) ? 'validator' : id.match(accountRegEx) || id.match(accountATOMRegEx) || id.match(accountTerraRegEx) ? 'account' : 'tx'
}