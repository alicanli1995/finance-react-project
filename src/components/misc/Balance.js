import {createContext, useEffect, useState} from "react";
import {useKeycloak} from "@react-keycloak/web";
import {bistApi} from "./BistApi";



export const DataContext = createContext();

const DataContextProvider = (props) => {
    const [balance, setBalance] = useState(0);

    const {keycloak} = useKeycloak();

    useEffect(async () => {
        keycloak.authenticated && await bistApi.getBalanceOnUser(keycloak.token).then((response) => {
            setBalance(response.data)
        })
    })

    return (
        <DataContext.Provider value={{ balance: balance , setBalance: setBalance}}>
            {props.children}
        </DataContext.Provider>
    );
};

export default DataContextProvider;