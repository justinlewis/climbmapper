/*eslint-disable*/
import React from 'react'
import ReactDOM from 'react-dom'
import { shallow, mount, render } from 'enzyme'

import AppContainerComponent from '../../app/AppContainer.jsx'

describe('AppContainerComponent', () => {
  xit("should render a primary div", () => {
    const wrapper = shallow(<AppContainerComponent />)
      expect(wrapper.find('#app').length).toEqual(1)
    })
})
