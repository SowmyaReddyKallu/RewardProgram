
import _ from 'lodash';

export const getSingleDeals =(row,tranData) =>{
  let byCustMonth = _.filter(tranData.pointsPerTransaction, (tRow)=>{
    return row.original.custid === tRow.custid && (row.original.monthNumber -1) === tRow.month;
  });
  return byCustMonth;
}

export const computeOutcomes=incomingData => {
  const months = ["January", "Febraury", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const pointsPerTransaction = incomingData.map(deal=> {
    return calculatePoints(deal);
  });

  let byCustomer = {};
  let sumOfRewardPointsByUser = {};
  pointsPerTransaction.forEach(pointsPerTransaction => {
    let {custid, name, month, rewards} = pointsPerTransaction;
    if (!byCustomer[custid]) {
      byCustomer[custid] = [];
    }
    if (!sumOfRewardPointsByUser[custid]) {
      sumOfRewardPointsByUser[name] = 0;
    }
    sumOfRewardPointsByUser[name] += rewards;
    if (byCustomer[custid][month]) {
      byCustomer[custid][month].rewards += rewards;
      byCustomer[custid][month].monthNumber = month+1;
      byCustomer[custid][month].numTransactions++;
    }
    else {

      byCustomer[custid][month] = {
        custid,
        name,
        monthNumber:month +1,
        month: months[month],
        numTransactions: 1,
        rewards
      }
    }
  });
  let tot = [];
  for (var custKey in byCustomer) {
    byCustomer[custKey].forEach(cRow=> {
      tot.push(cRow);
    });
  }

  let totByCustomer = [];
  for (custKey in sumOfRewardPointsByUser) {
    totByCustomer.push({
      name: custKey,
      rewards: sumOfRewardPointsByUser[custKey]
    });
  }
  return {
    sumByUser: tot,
    pointsPerTransaction,
    sumOfRewardPointsByUser:totByCustomer
  };
}


export const calculatePoints =deal=>{
  let rewards = 0;
  let over100 = deal.cost - 100;

  if (over100 > 0) {
    rewards += (over100 * 2);
  }
  if (deal.cost > 50 ) {
    if( deal.cost > 100)
    {
      rewards += 50;
    }
      else {
          rewards += ((deal.cost - 50) * 1);
      }
  }
  const month = new Date(deal.dealDate).getMonth();
  return {...deal, rewards, month};
}
