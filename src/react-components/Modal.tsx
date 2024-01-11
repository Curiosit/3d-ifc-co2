import React, { Dispatch, SetStateAction, useState } from 'react';


  
export function Modal() {
    const [isOpen, setIsOpen] = useState(true);
  
    const onClickOK = () => {
    
    
    };
  
    const cancel = () => {
    
    };
  
    
  
    return (
      <>
        
          <dialog className="popup" id="this-modal" >
            <h2 style={{ display: "flex", margin: "10px 0px 10px auto", columnGap: 10 }}>
              <span  className="material-symbols-rounded inline-icon" >error</span> <p id="modal-title">Title</p>
            </h2>
            <div className="popup-content">
              <p id="modal-msg">Text</p>
              <div style={{ display: "flex", justifyContent: "flex-end", margin: "10px 0px 10px auto", columnGap: 10 }}>
                <button  type="button" id="cancel-button" className="red" onClick={cancel}>
                  Cancel
                </button>
                <button id="modal-button" type="button" className="warning" onClick={onClickOK}>
                  OK
                </button>
              </div>
            </div>
          </dialog>
        
      </>
    );
  }