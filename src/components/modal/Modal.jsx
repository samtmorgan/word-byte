'use client';

import React from 'react';
import ReactModal from 'react-modal';

/* eslint-disable react/prop-types */
export const Modal = ({ open, setOpen, children, actions }) => (
  <ReactModal isOpen={open} onRequestClose={() => setOpen(false)} contentLabel="Modal" className="modal">
    <div className="modalContainer">
      <div className="modalCloseButtonContainer">
        <button onClick={() => setOpen(false)} type="button">
          ❌
        </button>
      </div>
      <div className="modalContentContainer">{children}</div>
      <div className="modalActionButtonContainer">{actions}</div>
    </div>
  </ReactModal>
);
