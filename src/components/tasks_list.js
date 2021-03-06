import React, { Component } from 'react'
import { connect } from 'react-redux'
import shortid from 'shortid'

import * as actions from '../actions'
import Notes from './notes'

class TasksList extends Component {
  componentWillMount() {
    this.props.getTasks(this.props.id)
  }

  componentWillUnmount() {
    this.props.clear()
  }

  convertTime(time) {
    if (!time) return time

    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time]

    if (time.length > 1) {
      time = time.slice(1)
      time[5] = +time[0] < 12 ? '  AM' : '  PM'
      time[0] = +time[0] % 12 || 12
    }

    return time.join('')
  }

  renderTasksList() {
    return this.props.tasks.sort((a, b) => a.time > b.time).map(tasks =>
      <div key={shortid.generate()}>
        <div className="row">
          <div className="col-sm-3">
            <li className="list-group-item">
              {' '}{this.convertTime(tasks.time)}
            </li>
          </div>
          <div className="col-sm-7">
            <li className="list-group-item">
              {tasks.completed
                ? <s>
                    {tasks.task}
                  </s>
                : tasks.task}
            </li>
          </div>
          <div className="col-sm-2">
            <button
              onClick={() =>
                this.props.completeTask(tasks._id.toString(), tasks.completed)}
              className={
                tasks.completed
                  ? 'btn btn-outline-warning completed'
                  : 'btn btn-outline-success open'
              }
            >
              <span
                className={tasks.completed ? 'fa fa-undo' : 'fa fa-check'}
                aria-hidden="true"
              />
            </button>
            <button
              onClick={() => this.props.deleteTask(tasks._id.toString())}
              className="btn btn-outline-danger delete"
            >
              <span className="fa fa-trash-o" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="list-group" id="tasks">
        {this.renderTasksList()}
        {/* {this.props.notes
          ? <Notes notes={this.props.notes} id={this.props.id}/>
          : console.log('bruh')} */}

        <Notes id={this.props.id} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { tasks: state.tasks }
}

export default connect(mapStateToProps, actions)(TasksList)
