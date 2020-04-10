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
    exp = Math.floor(timeToElapse / 3);
  } else if (periodType === 'weeks') {
    exp = Math.floor((timeToElapse * 7) / 3);
  } else {
    exp = (timeToElapse * 30) / 3;
  }

  const x = Math.floor(2 ** exp);
  return currentlyInfected * x;
}

function get15PercentOfInfectionsByRequestedTime(infections) {
  return 0.15 * infections;
}

function gethospitalBedsByRequestedTime(totalBeds, severeCases) {
  return totalBeds - severeCases;
}

const covid19ImpactEstimator = (data) => {
  console.log(data);
  const finalOutput = {
    data,
    impact: {},
    severeImpact: {}
  };
  finalOutput.impact.currentlyInfected = data.reportedCases * 10;
  finalOutput.severeImpact.currentlyInfected = data.reportedCases * 50;

  finalOutput.impact.infectionsByRequestedTime = infectionsByRequestedTime(
    finalOutput.impact.currentlyInfected,
    data.timeToElapse,
    data.periodType
  );

  finalOutput.severeImpact.infectionsByRequestedTime = infectionsByRequestedTime(
    finalOutput.severeImpact.currentlyInfected,
    data.timeToElapse,
    data.periodType
  );

  finalOutput.impact.severeCasesByRequestedTime = get15PercentOfInfectionsByRequestedTime(
    finalOutput.impact.infectionsByRequestedTime
  );

  finalOutput.severeImpact.severeCasesByRequestedTime = get15PercentOfInfectionsByRequestedTime(
    finalOutput.severeImpact.infectionsByRequestedTime
  );

  finalOutput.impact.hospitalBedsByRequestedTime = gethospitalBedsByRequestedTime(
    data.totalHospitalBeds,
    finalOutput.impact.severeCasesByRequestedTime
  );

  finalOutput.severeImpact.hospitalBedsByRequestedTime = gethospitalBedsByRequestedTime(
    data.totalHospitalBeds,
    finalOutput.severeImpact.severeCasesByRequestedTime
  );

  return finalOutput;
};

export default covid19ImpactEstimator;
