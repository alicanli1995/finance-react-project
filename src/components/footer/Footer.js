import React from "react";
import { CDBFooter, CDBFooterLink,CDBBox, CDBBtn, CDBIcon, CDBContainer } from 'cdbreact';


function Footer() {
    return (

        <CDBFooter className="shadow">
            <div style={{
                bottom: "0",
                left: "0",
                width: "100%",
                height: "100px",
                backgroundColor: "#f5f5f5",
                textAlign: "center",
                borderTop: "1px solid #e3e3e3"

            }}>
            <CDBBox
                display="flex"
                justifyContent="between"
                alignItems="center"
                className="mx-auto py-4 flex-wrap"
                style={{ width: '80%' }}
            >
                <CDBBox display="flex" alignItems="center">
                    <a href="/" className="d-flex align-items-center p-0 text-dark">
                        <img
                            alt="logo"
                            src="https://e7.pngegg.com/pngimages/872/687/png-clipart-investment-personal-finance-investor-loan-others-miscellaneous-text.png"
                            width="100PX"
                            style={{marginRight: '14px'}}
                        />
                        <span className="ml-4 h5 mb-0 font-weight-bold">Bist Tracker</span>
                    </a>
                </CDBBox>
                <CDBBox>
                    <small className="ml-2">&copy; Ali CANLI, 2022. All rights reserved.</small>
                </CDBBox>
                <CDBBox display="flex">
                    <CDBBtn flat color="dark" className="p-2">
                        <CDBIcon  fab icon="facebook-f" />
                    </CDBBtn>
                    <CDBBtn flat color="dark" className="mx-3 p-2">
                        <CDBIcon fab icon="twitter" />
                    </CDBBtn>
                    <CDBBtn flat color="dark" className="p-2">
                        <CDBIcon fab icon="instagram" />
                    </CDBBtn>
                </CDBBox>
            </CDBBox>
            </div>
        </CDBFooter>
    );
}

export default Footer;