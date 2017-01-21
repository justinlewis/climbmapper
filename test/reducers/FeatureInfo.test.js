import featureInfo from '../../app/reducers/FeatureInfoState.js';
import * as types from '../../app/constants/ActionTypes';


describe('the featureInfo reducer', () => {
  it('set a heading and areaInfo when passed a HOVER_FEATURE_INFO action', () => {
    const state = {
      heading : "",
      body: ""
    }
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
        info: {
          feature: {
            properties: {
              area: "Lumpy Ridge",
              pitches: 20,
              difficulty: 5.11
            },
          },
        },
    }
    const expected = {
      heading: "Lumpy Ridge",
      areaInfo: {
        area: "Lumpy Ridge",
        pitches: 20,
        difficulty: 5.11
      },
    }
    expect(featureInfo(state, hoverAction)).toEqual(expected)
  })

  it('should return the initial state', () => {
    const state = {
      heading : "",
      body : ""
    }

    const action = {
      type: null
    }

    const expected = {
      heading : "",
      body : ""
    }
    expect(featureInfo(state, action)).toEqual(expected)
  })
})
