import React, { Component } from 'react';
import CommentCardView from './CommentCardView'
import RaisedButton from 'material-ui/RaisedButton';
import logo from '../images/logo.svg';

class ReportView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      featuresAround: this.props.featuresAround
    };
    this.featuresCount = 0;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.featuresAround !== this.state.featuresAround) {
      this.setState({
        featuresAround: nextProps.featuresAround
      });
      if (nextProps.featuresAround) {
        this.featuresCount = nextProps.featuresAround.length;
      }
    }
  }

  goToMap = () => {
    this.props.onToggleToMapView();
  }

  createNew = () => {

  }

  render() {

    const features = this.state.featuresAround;
    let listItems = '';
    if (features) {
      listItems = features.map((feature) =>
        <CommentCardView key={feature.attributes.OBJECTID.toString()}
                  data={feature.attributes} />
      );
    }
    return (
      <div>
        <div>
          Hi There!
        </div>
        <div>
          {this.featuresCount} Nearby Comments
        </div>
        <RaisedButton label="go to map" onClick={this.goToMap}/>
        <div>
          {listItems}
        </div>
        <RaisedButton label="create new" onClick={this.createNew}/>
      </div>
    )
  }
}

export default ReportView;
