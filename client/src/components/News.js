import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

class News extends Component {

    state = {
        articles: []
    }

    componentDidMount() {
        axios.get('https://newsapi.org/v2/top-headlines?country=us&apiKey=17279e5e52c04dc1a189434c07aab8df')
            .then((response) => {
                let articles = response.data.articles;
                this.setState({
                    articles: articles
                });
            });
    }
    
    render() {

        let articleList = this.state.articles.map(function (article) {
            return (
                <div className="articleContainer">
                    <div className="articleTitle">{ article.description }</div>
                    <a href={ article.url }>Read More</a>
                </div>
            )
        });

        return (
            <div className="news">
                <div className="news">{ articleList }</div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        posts: state.posts
    }
}

const mapDispatchToProps = (dispatch) => {
    
}

export default connect(mapStateToProps)(News);