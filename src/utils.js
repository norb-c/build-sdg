import fs from 'fs';
import { Joi } from 'celebrate';
import xmlParser from 'object-to-xml';
import estimator from './estimator';

export const validate = Joi.object().keys({
  region: Joi.object().keys({
    name: Joi.string()
      .required()
      .error(new Error('Please enter the name of the region')),
    avgAge: Joi.number()
      .positive()
      .required()
      .error(
        new Error('Please enter a valid average age specified in region.avgAge')
      ),
    avgDailyIncomeInUSD: Joi.number()
      .positive()
      .required()
      .error(
        new Error(
          'Please enter a valid average daily income specified in region.avgDailyIncomeInUSD'
        )
      ),
    avgDailyIncomePopulation: Joi.number()
      .positive()
      .required()
      .error(
        new Error(
          'Please enter a valid average daily income population specified in region.avgDailyIncomePopulation'
        )
      )
  }),
  reportedCases: Joi.number()
    .positive()
    .required()
    .error(
      new Error('Please enter a valid reported case specified as reportedCases')
    ),
  population: Joi.number()
    .positive()
    .required()
    .error(
      new Error('Please enter a valid population specified as population')
    ),
  totalHospitalBeds: Joi.number()
    .positive()
    .required()
    .error(
      new Error(
        'Please enter a valid total hospital bed specified as totalHospitalBeds'
      )
    ),
  timeToElapse: Joi.number()
    .positive()
    .required()
    .error(
      new Error('Please enter a valid time to elapse specified as timeToElapse')
    ),
  periodType: Joi.string()
    .required()
    .error(
      new Error('Please enter a valid period type specified as periodType')
    )
});

export const defaultHandler = (req, res) => {
  try {
    const result = estimator(req.body);
    return res.status(200).send({
      result: { ...result },
      success: true,
      message: 'Successful'
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      error_code: 500,
      success: false,
      message: 'Server error'
    });
  }
};

export const xmlHandler = (req, res) => {
  res.set('Content-Type', 'application/xml');
  try {
    const result = estimator(req.body);
    result.success = true;
    result.message = 'Successful';

    const xmlResponse = xmlParser(result);

    return res.send(xmlResponse);
  } catch (error) {
    console.log(error);
    const c = {
      error_code: 500,
      success: false,
      message: 'Server error'
    };
    const xmlResponse = xmlParser(c);
    return res.status(500).send(xmlResponse);
  }
};

export const logToFile = (str) => {
  const logger = fs.createWriteStream('logs.log', {
    flags: 'a'
  });

  logger.write(str);
};
