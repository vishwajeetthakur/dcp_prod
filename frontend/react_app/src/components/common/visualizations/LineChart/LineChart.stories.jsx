import React from 'react';
// import { ARG_REDUX_PATH, PARAM_REDUX_MERGE_STATE } from 'addon-redux'
// import { within, userEvent } from '@storybook/testing-library';
// import { expect } from '@storybook/jest';


import LineChart from '.';

export default {
  title: 'visualizations/recharts/Line Chart',
  component: LineChart,
  argTypes: {},
}

const Template = (args) => <LineChart {...args} />;

export const Primary = Template.bind({});
Primary.args = {}

// // Interactions tests
// Primary.play = async ({ canvasElement }) => {
//     // Starts querying the component from its root element
//     const canvas = within(canvasElement);
  
//     // 👇 Simulate interactions with the component
//     await userEvent.type(canvas.getByLabelText('gander-textfield'), '33.L1XX.805834..TWCC');
  
//     // // See https://storybook.js.org/docs/react/essentials/actions#auto3matically-matching-args to learn how to setup logging in the Actions panel
//     await userEvent.click(canvas.getByLabelText('gander-submit-button'));
  
//     // 👇 Assert DOM structure
//     await expect(canvas.getByLabelText('gander-submit-button').disabled).toBe(true)

//     await expect(ARG_REDUX_PATH['globalStates.alerts.0.type'] === 'success').toBe(true)

//     await expect(ARG_REDUX_PATH['globalStates.alerts.0.message'] === 'success').toBe(true)
    
//     // await expect(canvas.getByLabelText('gander-submit-button').disabled = true)
//     // .toBeInTheDocument();
//   }
