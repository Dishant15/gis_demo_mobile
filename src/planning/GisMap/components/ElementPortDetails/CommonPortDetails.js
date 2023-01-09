import React from 'react';
import {Title} from 'react-native-paper';

import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';

import PortList from './PortList';

/**
 * Parent:
 *    ElementPortDetails
 */
const CommonPortDetails = ({
  portDetails,
  tableConfig,
  inputTitle = 'Input ports',
  outputTitle = 'Output ports',
}) => {
  const inputList = orderBy(
    filter(portDetails, ['is_input', true]),
    ['sr_no'],
    ['asc'],
  );
  const outputList = orderBy(
    filter(portDetails, ['is_input', false]),
    ['sr_no'],
    ['asc'],
  );

  return (
    <>
      <Title>{inputTitle}</Title>
      <PortList portList={inputList} tableConfig={tableConfig} />

      <Title>{outputTitle}</Title>
      <PortList portList={outputList} tableConfig={tableConfig} />
    </>
  );
};

export default CommonPortDetails;
