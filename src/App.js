import React, { Component } from "react";
import { ToastContainer } from 'react-toastify'; 
import "./App.css";
import 'react-toastify/dist/ReactToastify.css';
import config from './config.json';
import http from './services/httpService';

class App extends Component {
  state = {
    posts: []
  };

  async componentDidMount() {
    const { data: posts } = await http.get(config.apiEndpoint);
    this.setState({posts});
  }

  handleAdd = async () => {
    const obj = { title: 'a', body: 'b'};
    const { data: post } = await http.post(config.apiEndpoint, obj);
    const posts = [post, ...this.state.posts];
    this.setState({posts});
  };

  handleUpdate = async post => {
    post.title = "UPDATED"
    await http.put(config.apiEndpoint + '/' + post.id, post)
    
    const posts = [...this.state.posts];
    const index = posts.indexOf(post);
    posts[index] = {...post};
    this.setState({posts})

  };

  handleDelete = async post => {
    // Optimistic Updats
    // - First update the UI, to make users feel it is a fast responsive UI
    // - then call server and revert UI back if error
    const originalPosts = this.state.posts;
    const posts = this.state.posts.filter(p => p.id !== post.id);
    this.setState({posts})
    try {
      await http.delete('ss' + config.apiEndpoint + '/' + post.id)
      throw new Error('')
    } catch (ex) {
      // Expected (404: not found. 400: bad request) - CLIENT ERRORS
      // - Display a specific error message
      // Unexpected (nettwork down, server down, db down, bug)
      // - Log them
      // - Display a generic and friendly error message
      if (ex.response && ex.response.status === 404) {
        alert('This post has already been deleted.')
      }
      this.setState({ posts: originalPosts});
    }

  };

  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <button className="btn btn-primary" onClick={this.handleAdd}>
          Add
        </button>
        <button onClick={this.methodDoesNotExist}>Break the world</button>;
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map(post => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => this.handleUpdate(post)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => this.handleDelete(post)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default App;
