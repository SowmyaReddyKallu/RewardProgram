import React, { useState, useEffect } from "react";
import fetch from './api/customerInfo';
import ReactTable from 'react-table';
import "./App.css";
import 'react-table/react-table.css';
import {computeOutcomes,getSingleDeals} from './computeOutcomes';
import {columns, sumByColumns} from  './api/dataColumns';

function App() {
  const [dealInfo, setDealInfo] = useState(null);

  useEffect(() => {
    fetch().then((data)=> {
      const results = computeOutcomes(data);
      setDealInfo(results);
    });
  },[]);

  if (dealInfo == null) {
    return <div>Wait While Loading</div>;
  }

  return dealInfo == null ?
    <div>Wait While Loading</div>
      :
    <div>

      <div className="container">
        <div className="row">
          <div className="col-10">
            <h2>Monthly Customer Reward Points</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-8">
            <ReactTable
              data={dealInfo.sumByUser}
              defaultPageSize={4}
              columns={columns}
              SubComponent={row => {
                return (
                  <div>

                      {getSingleDeals(row,dealInfo).map(tran=>{
                        return <div className="container">
                          <div className="row">
                            <div className="col-8">
                              <strong>Deal Date:</strong> {tran.dealDate} - <strong>$</strong>{tran.cost} - <strong>Rewards: </strong>{tran.rewards}
                            </div>
                          </div>
                        </div>
                      })}

                  </div>
                )
              }}
              />
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-10">
              <h2>Each Customer Rewards</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-8">
              <ReactTable
                data={dealInfo.sumOfRewardPointsByUser}
                columns={sumByColumns}
                defaultPageSize={4}
              />
            </div>
          </div>
        </div>
    </div>
  ;
}

export default App;
