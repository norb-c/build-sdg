function convertToDays(period, periodType) {
  let days;
  if (periodType === 'days') {
    days = period;
  } else if (periodType === 'weeks') {
    days = period * 7;
  } else {
    days = period * 30;
  }
  return days;
}

function infectionsByRequestedTime(
  currentlyInfected,
  timeToElapse,
  periodType
) {
  const exp = Math.floor(convertToDays(timeToElapse, periodType) / 3);

  const x = Math.floor(2 ** exp);
  return currentlyInfected * x;
}

function get15PercentOfInfectionsByRequestedTime(infections) {
  return 0.15 * infections;
}

function gethospitalBedsByRequestedTime(totalBeds, severeCases) {
  const availableBeds = 0.35 * totalBeds;

  return Math.ceil(availableBeds - severeCases);
}

function getCasesForICUByRequestedTime(infectionsByTime) {
  return Math.ceil(0.05 * infectionsByTime);
}

function getCasesForVentilatorsByTime(infectionsByTime) {
  return Math.ceil(0.02 * infectionsByTime);
}

function getDollarsInFlight(
  infectionsByTime,
  avgIncomePopu,
  avgIncome,
  period,
  periodType
) {
  const days = convertToDays(period, periodType);
  return Math.ceil(avgIncomePopu * infectionsByTime * avgIncome * days);
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

  finalOutput.impact.casesForICUByRequestedTime = getCasesForICUByRequestedTime(
    finalOutput.impact.infectionsByRequestedTime
  );

  finalOutput.severeImpact.casesForICUByRequestedTime = getCasesForICUByRequestedTime(
    finalOutput.severeImpact.infectionsByRequestedTime
  );

  finalOutput.impact.casesForVentilatorsByRequestedTime = getCasesForVentilatorsByTime(
    finalOutput.impact.infectionsByRequestedTime
  );

  finalOutput.severeImpact.casesForVentilatorsByRequestedTime = getCasesForVentilatorsByTime(
    finalOutput.severeImpact.infectionsByRequestedTime
  );

  finalOutput.impact.dollarsInFlight = getDollarsInFlight(
    finalOutput.impact.infectionsByRequestedTime,
    data.region.avgDailyIncomePopulation,
    data.region.avgDailyIncomeInUSD,
    data.region.timeToElapse,
    data.region.periodType
  );

  finalOutput.severeImpact.dollarsInFlight = getDollarsInFlight(
    finalOutput.severeImpact.infectionsByRequestedTime,
    data.region.avgDailyIncomePopulation,
    data.region.avgDailyIncomeInUSD,
    data.region.timeToElapse,
    data.region.periodType
  );

  return finalOutput;
};

export default covid19ImpactEstimator;
