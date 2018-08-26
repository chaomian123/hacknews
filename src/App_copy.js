import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux'
const PATH_BASE = 'https://hn.algolia.com/api/v1'
const PATH_SEARCH = '/search'
const PARAM_SEARCH = 'query='



//
// const list = [
//     {
//         title: '江苏神州信源系统工程有限公司',
//         url: 'https://jobs.zhaopin.com/343132413250305.htm',
//         author: 'web前端开发',
//         num_comments: '15K-20K',
//         points: '建邺区',
//         objectID: 0,
//     },
//     {
//         title: '南京米雅途网络科技有限公司',
//         url: 'https://jobs.zhaopin.com/CZ552531420J00001870107.htm',
//         author: 'app前端开发工程师(web/app)',
//         num_comments: '7K-13K',
//         points: '玄武区',
//         objectID: 1,
//     },
//     {
//         title: '南京腾程文化传媒有限公司',
//         url: 'https://jobs.zhaopin.com/CC818351160J00171242705.htm',
//         author: 'Web前端开发',
//         num_comments: '6K-8K',
//         points: '玄武区',
//         objectID: 3,
//     },
//     {
//         title: '江苏中石电子科技有限公司',
//         url: 'https://jobs.zhaopin.com/CZ454009130J00040661702.htm',
//         author: 'web前端开发工程师',
//         num_comments: '10K-15K',
//         points: '雨花区',
//         objectID: 4,
//     },
//     {
//         title: '南京万物软件科技有限公司',
//         url: 'https://jobs.zhaopin.com/475983931250145.htm',
//         author: 'web前端开发工程师',
//         num_comments: '9K-14K',
//         points: '玄武区',
//         objectID: 5,
//     },
//     {
//         title: '江苏柠檬网络科技有限公司',
//         url: 'https://jobs.zhaopin.com/268027587250020.htm',
//         author: '前端开发工程师',
//         num_comments: '5K-8K',
//         points: '江宁区',
//         objectID: 6,
//     },
//     {
//         title: '南京聚奢网络科技有限公司',
//         url: 'https://jobs.zhaopin.com/310811539250207.htm',
//         author: 'Web前端开发（小程序）',
//         num_comments: '8K-12K',
//         points: '玄武区',
//         objectID: 7,
//     },
// ]
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
        // 这里是如果这个id不是点击的id则保留，如果是点击的id则过滤掉
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