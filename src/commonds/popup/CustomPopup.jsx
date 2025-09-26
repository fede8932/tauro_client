import React from 'react';
import { Popup } from 'semantic-ui-react';
import styles from './customPopup.module.css';

const CustomPopup = (props) => {
  const { content, characters } = props;
  return (
    <Popup
      style={{ padding: '5px', fontWeight: '600', border: '2px solid #B6B6B6' }}
      content={content}
      trigger={
        <span>{`${content.substr(0, characters ? characters : 30)}...`}</span>
      }
    />
  );
};

export default CustomPopup;
