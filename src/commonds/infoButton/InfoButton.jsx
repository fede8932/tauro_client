import React from 'react';
import { Button } from 'semantic-ui-react';

const InfoButton = (props) => {
  const click = (e) => {
    props.onClick();
  };
  return (
    <Button type="button" onClick={click}>
      {props.text}
    </Button>
  );
};

export default InfoButton;
