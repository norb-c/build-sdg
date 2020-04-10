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
function infectionsByRequestedTime(currentlyInfected, days) {
  const exp = days / 3;
  return currentlyInfected * 2 ** exp;
}

const covid19ImpactEstimator = (data) => {
  const finalOutput = {
    data: {},
    impact: {},
    servereImpact: {}
  };
  finalOutput.impact.currentlyInfected = data.reportedCases * 10;
  finalOutput.servereImpact.currentlyInfected = data.reportedCases * 50;

  // infected for 30 days (could be a function that takes days)
  finalOutput.impact.infectionsByRequestedTime = infectionsByRequestedTime(
    finalOutput.impact.currentlyInfected,
    30
  );

  finalOutput.servereImpact.infectionsByRequestedTime = infectionsByRequestedTime(
    finalOutput.servereImpact.currentlyInfected,
    30
  );

  return finalOutput;
};

export default covid19ImpactEstimator;
