import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux'
const PATH_BASE = 'https://hn.algolia.com/api/v1'
const PATH_SEARCH = '/search'
const PARAM_SEARCH = 'query='


//主界面的框体是使用的flex布局，这里是定义一下各框格占据的宽度
const largeColumn = { width: '40%', };
const midColumn = { width: '30%', };
const smallColumn = { width: '10%', }
const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase())


class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            result: null,
            searchTerm: DEFAULT_QUERY,
        }
        this.setSearchTopStories = this.setSearchTopStories.bind(this)
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this)
        this.onDismiss = this.onDismiss.bind(this)
        this.onSearchChange = this.onSearchChange.bind(this)
    }

    setSearchTopStories(result) {
        this.setState({ result })
    }
    //用fetch取代了ajax实现了对hacknews新闻api数据的获取，使用promise实现异步
    fetchSearchTopStories(searchTerm) {
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
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
        const updatedHits = this.state.result.hits.filter(item => item.objectID !== id)
        this.setState({
            result: { ...this.state.result, hits: updatedHits}
        })
    }
    render() {
        //让代码变得更加简短
        const { searchTerm, result} = this.state
        if (!result) { return null }
        return (
            <div className="App">
                <div className='page'>
                    <div className='interactions'>
                        <Search
                            value={searchTerm}
                            onChange={this.onSearchChange}
                        >
                            Search
                        </Search>
                        <Table
                            list={result.hits}
                            pattern={searchTerm}
                            onDismiss={this.onDismiss}
                        />
                    </div>
                </div>


            </div>
        )
    }
}

//暂未用到的按钮组件
class ExplainBindingsComponent extends Component {
    constructor() {
        super()
        this.onClickMe = this.onClickMe.bind(this)
    }
    onClickMe() {
        console.log(this)
    }
    render() {
        return(
            <button
                onClick={this.onClickMe}
                type='button'
            >
                Click Me
            </button>
        )
    }
}

//搜索结果表组件
const Table = ({ list, pattern, onDismiss }) => {
    return (
        <div className='table'>
            {list.filter(isSearched(pattern)).map(item =>
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

const Search = ({ value, onChange, children }) => {
    return(
        <form>
            {children} <input
            type="text"
            value={value}
            onChange={onChange}
        />
        </form>
    )
}



const Delete_Button = ({ onDismiss, keys }) => {
    return (
        <span>
                <button
                    onClick={() => onDismiss(keys)}
                    type='button'
                >
                    dismiss
                </button>
            </span>
    )
}


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
