import React from 'react';
import styles from './customSearch.module.css';
import CustomButton from '../button/CustomButton';
import { useRef } from 'react';
import { useState } from 'react';

const CustomSearch = () => {
  const inputRef = useRef(null);
  const [classDivContainer, setClassDivContainer] = useState('searchContainer');
  return (
    <div
      className={styles[classDivContainer]}
      onClick={() => {
        inputRef.current.focus();
        setClassDivContainer('searchContainerActive');
      }}
      onBlur={() => {
        setClassDivContainer('searchContainer');
      }}
    >
      <form className={styles.formSearchConteiner}>
        <i className={`${styles.searchIcon} fas fa-search`}></i>
        <input
          ref={inputRef}
          className={styles.searchInput}
          type="text"
          disabled
        />
      </form>
      <CustomButton
        props={{
          buttonStyle: 'findButton',
          icon: 'fas fa-filter',
          iconStyle: 'findIconVio',
          iconHoverStyle: 'findIconBla',
        }}
      />
    </div>
  );
};

export default CustomSearch;
