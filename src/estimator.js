// {
//    region: {
//    name: "Africa",
//    avgAge: 19.7,
//    avgDailyIncomeInUSD: 5,
//    avgDailyIncomePopulation: 0.71
//    },
//    periodType: "days",
//    timeToElapse: 58,
//    reportedCases: 674,
//    population: 66622705,
//    totalHospitalBeds: 1380614
//    }

// {
//    data: {}, // the input data you got
//    impact: {}, // your best case estimation
//    severeImpact: {} // your severe case estimation
// }
function infectionsByRequestedTime(
  currentlyInfected,
  timeToElapse,
  periodType
) {
  let exp;
  if (periodType === 'days') {
    exp = timeToElapse / 3;
  } else if (periodType === 'weeks') {
    exp = (timeToElapse * 7) / 3;
  } else {
    exp = (timeToElapse * 30) / 3;
  }

  return currentlyInfected * 2 ** exp;
}

const covid19ImpactEstimator = (data) => {
  const finalOutput = {
    data,
    impact: {},
    servereImpact: {}
  };
  finalOutput.impact.currentlyInfected = data.reportedCases * 10;
  finalOutput.servereImpact.currentlyInfected = data.reportedCases * 50;

  // infected for 30 days (could be a function that takes days)
  finalOutput.impact.infectionsByRequestedTime = infectionsByRequestedTime(
    finalOutput.impact.currentlyInfected,
    data.timeToElapse,
    data.periodType
  );

  finalOutput.servereImpact.infectionsByRequestedTime = infectionsByRequestedTime(
    finalOutput.servereImpact.currentlyInfected,
    data.timeToElapse,
    data.periodType
  );

  return finalOutput;
};

export default covid19ImpactEstimator;
