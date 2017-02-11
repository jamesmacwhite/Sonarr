import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { inputTypes, kinds } from 'Helpers/Props';
import Button from 'Components/Link/Button';
import ModalContent from 'Components/Modal/ModalContent';
import ModalHeader from 'Components/Modal/ModalHeader';
import ModalBody from 'Components/Modal/ModalBody';
import ModalFooter from 'Components/Modal/ModalFooter';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormLabel from 'Components/Form/FormLabel';
import FormInputGroup from 'Components/Form/FormInputGroup';
import styles from './TagsModalContent.css';

class TagsModalContent extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      tags: [],
      applyTags: 'add'
    };
  }

  //
  // Lifecycle

  onInputChange = ({ name, value }) => {
    this.setState({ [name]: value });
  }

  onApplyTagsPress = () => {
    const {
      tags,
      applyTags
    } = this.state;

    this.props.onApplyTagsPress(tags, applyTags);
  }

  //
  // Render

  render() {
    const {
      onModalClose,
      onApplyTagsPress
    } = this.props;

    const {
      tags,
      applyTags
    } = this.state;

    const applyTagsOptions = [
      { key: 'add', value: 'Add' },
      { key: 'remove', value: 'Remove' },
      { key: 'replace', value: 'Replace' }
    ];

    return (
      <ModalContent onModalClose={onModalClose}>
        <ModalHeader>
          Tags
        </ModalHeader>

        <ModalBody>
          <Form>
            <FormGroup>
              <FormLabel>Tags</FormLabel>

              <FormInputGroup
                type={inputTypes.TAG}
                name="tags"
                value={tags}
                onChange={this.onInputChange}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Apply Tags</FormLabel>

              <FormInputGroup
                type={inputTypes.SELECT}
                name="applyTags"
                value={applyTags}
                values={applyTagsOptions}
                helpTexts={[
                  'How to apply tags to the selected series',
                  'Add: Add the tags the existing list of tags',
                  'Remove: Remove the entered tags',
                  'Replace: Replace the tags with the entered tags (enter no tags to clear all tags)'
                ]}
                onChange={this.onInputChange}
              />
            </FormGroup>
          </Form>
        </ModalBody>

        <ModalFooter>
          <Button onPress={onModalClose}>
            Cancel
          </Button>

          <Button
            kind={kinds.PRIMARY}
            onPress={this.onApplyTagsPress}
          >
            Apply
          </Button>
        </ModalFooter>
      </ModalContent>
    );
  }
}

TagsModalContent.propTypes = {
  onModalClose: PropTypes.func.isRequired,
  onApplyTagsPress: PropTypes.func.isRequired
};

export default TagsModalContent;
