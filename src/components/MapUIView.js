import React, { Component } from 'react';
import CommentCardView from './CommentCardView';
import RaisedButton from 'material-ui/RaisedButton';

class MapUIView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentSelection: this.props.currentSelection
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentSelection !== this.state.currentSelection) {
      this.setState({
        currentSelection: nextProps.currentSelection
      })
    }

  }

  goToReport = () => {
    this.props.onToggleToReportView();;
  }

  render() {
    return (
      <div>
        <div>
          <RaisedButton label="go to Report" onClick={this.goToReport}/>
        </div>
        <div>
          { this.state.currentSelection &&
            <CommentCardView data={this.state.currentSelection} />
          }
        </div>
      </div>
    );
  }

}

export default MapUIView;
