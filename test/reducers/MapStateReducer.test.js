import map from '../../app/reducers/MapState.js';

describe('the MapState reducer', () => {
  it('set a heading and areaInfo when passed a HOVER_FEATURE_INFO action', () => {
    const state = {
      center: [0, 0]
    }
    const action = {
      type: 'LOAD_MAP'
    }

    const expected = {
      center: [1, 1]
    }

    expect(map(state, action)).toEqual(expected)
  })


})
