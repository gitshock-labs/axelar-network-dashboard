export const chainTitle = data => data?.title && data.title.split(' ').length < 3 ? data.title : data?.short_name

export const getChain = (id, chains) => chains?.find(_chain => [_chain?.id?.toLowerCase(), _chain?.maintainer_id?.toLowerCase()].includes(id?.toLowerCase()))

export const chain_manager = {
  id: (id, chains) => getChain(id, chains)?.id || id,
  maintainer_id: (id, chains) => getChain(id, chains)?.maintainer_id || id,
  title: (id, chains) => getChain(id, chains)?.title,
  image: (id, chains) => getChain(id, chains)?.image,
}