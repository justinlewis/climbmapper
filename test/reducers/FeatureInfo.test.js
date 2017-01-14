import featureInfo from '../../app/reducers/FeatureInfoState.js';
import * as types from '../../app/constants/ActionTypes';


describe('the route type reducer', () => {
  xit('set a heading and areaInfo when passed a HOVER_FEATURE_INFO action', () => {
    const action = {
      info: {
        feature: {
          properties: {
            area: "Lumpy Ridge",
            pitches: 20,
            difficulty: 5.10
          },
        },
      },
    }

    const hoverAction = {
      type: 'HOVER_FEATURE_INFO',
      heading: action.info.feature.properties.area,
      areaInfo: action.info.feature.properties,
    }
    const expected = {
      heading: "Lumpy Ride",
      areaInfo: {
        area: "Lumpy Ridge",
        pitches: 20,
        difficulty: 5.10
      },
    }

    expect(featureInfo({}, hoverAction)).toEqual(expected)
  })
})
