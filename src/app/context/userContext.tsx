"use client";

import React, { createContext, useContext, ReactNode, useState } from 'react';

const AppContext = createContext<any>(undefined);

export function AppWrapper ({children} : {
  children : React.ReactNode;
}) {
  let [userId , setUserId] = useState<string>('');

  return (
    <AppContext.Provider value={{userId,setUserId}}>
      {children}
    </AppContext.Provider>
  )
}


export function useAppContext () {

  return useContext (AppContext);
}