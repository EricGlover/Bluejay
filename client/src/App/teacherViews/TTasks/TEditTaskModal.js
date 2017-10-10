import React from "react";

//components
import Undoable from "../../GlobalComponents/Undoable";
import Paper from "material-ui/Paper";
import Dialog from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";

const ModalTitle = props => {
  return (
    <div className="modal-title-container">
      <h1>Modify your task</h1>
    </div>
  );
};
const style = {
  margin: 12
};
class TEditTaskModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      title: this.props.task.title,
      description: this.props.task.description
    };
  }
  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = e => {
    this.setState({ open: false });
  };
  onSave = e => {
    // console.log("saving");
    this.props.onSubmit({
      title: this.state.title,
      description: this.state.description
    });
    this.setState({ open: false });
  };
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        style={style}
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Save"
        secondary={true}
        style={style}
        onClick={this.onSave}
      />
    ];
    return (
      <div>
        <RaisedButton onClick={this.handleOpen} label="Edit" />
        <Dialog
          title={<ModalTitle />}
          open={this.state.open}
          actions={actions}
          onRequestClose={this.handleClose}
        >
          <div>
            <TextField
              floatingLabelText="title"
              floatingLabelFixed={true}
              underlineShow={false}
              name="title"
              value={this.state.title}
              onChange={this.onChange}
            />
            <TextField
              floatingLabelText="description"
              floatingLabelFixed={true}
              fullWidth={true}
              underlineShow={false}
              multiLine={true}
              name="description"
              value={this.state.description}
              onChange={this.onChange}
            />
          </div>
        </Dialog>
      </div>
    );
  }
}

export default TEditTaskModal;