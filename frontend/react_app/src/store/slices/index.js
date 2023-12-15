import { createSlice } from '@reduxjs/toolkit'

export const slices = createSlice({
  name: 'slices',
  initialState: {
    alerts: {
      type: null,
      message: null,
    },
    menus: [],
    tabs: 0,
    colorMode: localStorage.getItem('colorMode')
      ? localStorage.getItem('colorMode')
      : () => {
        localStorage.setItem('colorMode', 'light');
        return 'light';
      },
    trackedEvents: [],

    // DesignPortal Old
    dpDummyData: [],
    selectedDefinitions: null,
    isFormValueChange: false,
    pathNameChange: '',
    formValues: null,
    progressRatio: 0,
    designPortal: {
        cedt: {},
        eset: {},
        salesforce: {},
        granite: {},
    },

    // DesignPortal
    designPortalData: null,
    designPortalAttachmentList: [],
    loadingDesignPortalOrder: false,
  },
  reducers: {
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the Immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes

    createAlert: (state, action) => {
      state.alerts = ({
        message: action.payload.message,
        type: action.payload.type,
      });
    },

    handleMenu: (state, action) => {
      // toggles a key with a boolean
      state.menus = ({
        ...state.menus,
        [action.payload.key]: action.payload.value,
      });
    },

    handleTabChange: (state, action) => {
      state.tabs = action.payload;
    },

    toggleColorMode: (state, action) => {
      // toggles the color mode between 'light' and 'dark'
      state.colorMode = state.colorMode === 'light' ? 'dark' : 'light';

      localStorage.setItem('colorMode', state.colorMode === 'light' ? 'dark' : 'light');
    },

    tracking: (state, action) => {
      state.trackedEvents.push(action.payload);
    },

    // DesignPortal Old

    postDesignPortalDummyData: (state, action) => {
      state.dpDummyData.push(action.payload);
    },

    makeDesignPortalSelections: (state, action) => {
      const selections = {
        ...state.designPortal,
        ...action.payload,
      };

      // console.log('makeDesignPortalSelctions action: ', selections, state.designPortal, action.payload)

      state.designPortal = selections;
    },

    clearDesignPortalSelections: (state, action) => {
      state.designPortal = initialDesignPortalState;
    },

    setSelectedDefinitions: (state, action) => {
      state.selectedDefinitions = action.payload;
    },

    handleFormChange: (state, action) => {
      // set boolen value form value change
      state.isFormValueChange = action.payload.value;
    },
    handlePathChange: (state, action) => {
      // set boolen value form value change
      state.pathNameChange = action.payload.value;
    },
    handleFormValues: (state, action) => {
      // set form value change
      state.formValues = { ...action.payload.value };
    },

    setProgressRatio: (state, action) => {
      // set progress ratio for form completion in the design portal
      // console.log('setProgressRatio redux action: ', action)
      state.progressRatio = action.payload;
    },

    // DesignPortal

    setDesignPortalAttachmentList: (state, action) => {
        state.designPortalAttachmentList = action.payload
    },

    setLoadingDesignPortalOrder: (state, action) => {
      state.loadingDesignPortalOrder = action.payload
    },

    setDesignPortalData: (state, action) => {
        state.designPortalData = action.payload
    }

  },
});

// Action creators are generated for each case reducer function
export const { actions } = slices;

export default slices;