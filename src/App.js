import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'react'
const PATH_BASE = 'https://hn.algolia.com/api/v1'
const PATH_SEARCH = '/search'
const PARAM_SEARCH = 'query='
const PARAM_PAGE = 'page='




const largeColumn = { width: '40%', };
const midColumn = { width: '30%', };
const smallColumn = { width: '10%', }
// const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase())


class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            result: null,
            searchTerm: DEFAULT_QUERY,
        }
        this.setSearchTopStories = this.setSearchTopStories.bind(this)
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this)
        this.onSearchChange = this.onSearchChange.bind(this)
        this.onSearchSubmit = this.onSearchSubmit.bind(this)
        this.onDismiss = this.onDismiss.bind(this)

    }
    onSearchSubmit(event) {
        const { searchTerm }= this.state
        this.fetchSearchTopStories(searchTerm)
        event.preventDefault()
    }
    setSearchTopStories(result) {
        const { hits, page } = result
        const oldHits = page !== 0
            ? this.state.result.hits
            : []
        const updatedHits = [
            ...oldHits,
            ...hits
        ]

        this.setState({
            result: {hits: updatedHits, page }
        })
    }
    fetchSearchTopStories(searchTerm, page = 0) {
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`)
            .then(response => response.json())
            .then(result => this.setSearchTopStories(result))
            .catch(e => e)
    }

    componentDidMount() {
        const { searchTerm } = this.state
        this.fetchSearchTopStories(searchTerm)
    }

    onSearchChange(event) {
        this.setState({
            searchTerm: event.target.value,
        })
    }
    onDismiss(id) {
        // 这里是如果这个id不是点击的id则保留，如果是点击的id则过滤掉
        const updatedHits = this.state.result.hits.filter(item => item.objectID !== id)
        this.setState({
            result: { ...this.state.result, hits: updatedHits}
        })
    }
    render() {
        //让代码变得更加简短
        const { searchTerm, result} = this.state
        const page = ( result && result.page ) || 0
        // if (!result) { return null }
        return (
        <div className="App">
            <div className='page'>
                <div className='interactions'>
                    <Search
                        value={searchTerm}
                        onChange={this.onSearchChange}
                        onSubmit={this.onSearchSubmit}
                    >
                        Search
                    </Search>
                    {result &&
                         <Table
                            list={result.hits}
                            onDismiss={this.onDismiss}
                        />
                    }
                    <div className='interactions'>
                        <Button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>
                            More
                        </Button>
                    </div>
                </div>
            </div>


      </div>
    )
  }
}

// class ExplainBindingsComponent extends Component {
//     constructor() {
//         super()
//         this.onClickMe = this.onClickMe.bind(this)
//     }
//     onClickMe() {
//         console.log(this)
//     }
//     render() {
//         return(
//             <button
//                 onClick={this.onClickMe}
//                 type='button'
//             >
//                 Click Me
//             </button>
//         )
//     }
// }

const Table = ({ list, onDismiss }) => {
    return (
        <div className='table'>
            {list.map(item =>
                    <div key={item.objectID} className='table-row'>
                      <span style={largeColumn}>
                          <a href={item.url} >{item.title}</a>
                      </span>
                        <span style={midColumn}>{item.author}</span>
                        <span style={smallColumn}>{item.num_comments}</span>
                        <span style={smallColumn}>{item.points}</span>
                        <span style={smallColumn}>
                            <Button className='button-inline'
                                onClick={() => onDismiss(item.objectID)}
                            >
                                不感兴趣
                            </Button>
                        </span>
                        {/*<Delete_Button keys={item.objectID} onDismiss={onDismiss}/>*/}
                    </div>
            )}
        </div>
     )
}

const Search = ({ value, onChange, children, onSubmit }) => {
        return(
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                />
                <button type="submit">
                    {children}
                </button>
            </form>
        )
    }



// const Delete_Button = ({ onDismiss, keys }) => {
//         return (
//             <span>
//                 <button
//                     onClick={() => onDismiss(keys)}
//                     type='button'
//                 >
//                     dismiss
//                 </button>
//             </span>
//         )
// }


const Button =({ onClick, className, children }) => {
    return (
        <button
            onClick={onClick}
            className={className}
            type='button'
        >
            {children}
        </button>
    )
}


export default App;