import React from 'react'
import 'tachyons'

const SearchBox = ({ onSearch, search }) => {
  return (
      <div className='pa2'>
    <input type='search' placeholder='Search here...' className='pa2' onChange={onSearch} style={{width: '40vw'}} />
    </div>
  )
}

export default SearchBox