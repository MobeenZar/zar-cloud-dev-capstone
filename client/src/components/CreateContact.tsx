import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { createContact } from '../api/contacts-api'

enum UploadState {
  NoUpload,
  UploadingData
}

interface CreateContactProps {
  match: {
    params: {}
  }
  auth: Auth
}

interface CreateContactState {
  name: string
  description: string
  address: string
    phone: string
  uploadState: UploadState
}

export class CreateContact extends React.PureComponent<
  CreateContactProps,
  CreateContactState
> {
  state: CreateContactState = {
    name: '',
    description: '',
    address: '',
    phone: '',
    uploadState: UploadState.NoUpload
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ description: event.target.value })
  }

  handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ address: event.target.value })
  }

  handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ phone: event.target.value })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    if (this.state.name.trim() == '') {
      alert('Name is required.')
      return
    }
    try {
      this.setUploadState(UploadState.UploadingData)
      await createContact(
        this.props.auth.getIdToken(),
        this.state.name,
        this.state.description,
        this.state.address,
        this.state.phone
      )

      alert('New contact added successfully.')
    } catch (e) {
      alert('Could not upload a file: ' + e)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  render() {
    return (
      <div>
        <h1>Create new Contact</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Name</label>
            <input
              placeholder="Contact Name"
              value={this.state.name}
              onChange={this.handleNameChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <input
              placeholder="Contact Description"
              value={this.state.description}
              onChange={this.handleDescriptionChange}
            />
          </Form.Field>

          <Form.Field>
            <label>Address</label>
            <input
              placeholder="Address"
              value={this.state.address}
              onChange={this.handleAddressChange}
            />
          </Form.Field>

          <Form.Field>
            <label>Phone Number</label>
            <input
              placeholder="Phone Number"
              value={this.state.phone}
              onChange={this.handlePhoneChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {
    return (
      <div>
        {this.state.uploadState === UploadState.UploadingData && (
          <p>Uploading Contact metadata</p>
        )}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Add Contact
        </Button>
      </div>
    )
  }
}
