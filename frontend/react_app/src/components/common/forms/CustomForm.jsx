// Packages
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Field, Form, FormikProvider, useFormik, } from 'formik'
import {
  Box, Button, Grid, InputLabel,
  FormGroup, FormControlLabel, MenuItem,
  ListItemButton,
  Select, Switch, 
  // TextField,
  Typography, FormControl,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import { v4 as uuidv4 } from 'uuid';
import { TextField, } from 'formik-mui';

// Components

// Hooks
import { useKeycloakUser } from '../../hooks';

// Utils
// import { designPortalApi } from '../../pages/ManagedServices/utilities/api';
import { actions } from '../../../store'
import {
  capFirst,
  formatDate,
  normalizeCamelCase,
} from '../../../utilities'

// Styles
import './CustomForm.scss';
import { OuterContentPaper } from '../../common/styled.components';



const CustomForm = ({ definitions, trackEvent, cancelHandler, submitHandler }) => {
  // Hooks
  const dispatch = useDispatch()
  const { designPortal, menus } = useSelector(state => state.globalStates)
  const { keycloakUser } = useKeycloakUser()
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const formik = useFormik({
    // Starting with no values before any form elements are generated
    initialValues: {},
    onSubmit: async (values) => {
      alert(JSON.stringify(values, null, 2));

      
      // track the user event in a global user event tracker
      trackEvent({
        action: 'submitted form',
        user: keycloakUser.name,
        updated_at: formatDate(new Date())
      })

      // // POST to backend for continued testing
      // const response = await designPortalApi.submit({
      //   cid: designPortal.selectedCid,
      //   customer_address: designPortal.selectedCustomerSite,
      //   section: definitions.label,
      //   values,
      // })

      // console.log('managed_services form submit response: ', { response, values })

      // Dispatch Success Alert
      dispatch(actions.createAlert({
          message: 'Success!',
          type: 'success',
      }))

    },
    validateOnBlur: false,
    validateOnChange: false,

  });
  
  // State / Refs
  const [elements, setElements] = useState([])
  const [customFormSections, setCustomFormSections] = useState([
    { definitions: [] },
  ])
  const [counter, setCounter] = useState(0)
  
  // Helpers
  const subRoutePathname = location.pathname.split('/')[2]
  let hasNestedFields = Object.keys(definitions.fields[0]).includes('label')
  let hasNestedElements = (elements.length < 1 || !hasNestedFields)
    ? false
    : elements
      .map((element, i) => Array
        .isArray(element))
        .some(elementIsArray => elementIsArray)

  const generateElementsFromJson = async json => json.map(({
    name,
    type,
    required,
    options,
    value,
    disabled,
    default: defaultValue,
    validate,
  }, i) => {

    if (type === null || type === undefined) return null

    if (type === 'radio') return (
      <FormGroup key={'radio-button-' + name + '-' + uuidv4()} sx={{ ml: '25%' }}>
        <FormControlLabel
          control={(
            <Field name={name} type="checkbox" id={name} color="primary" value={formik.values[name] || ''} />
            )}
          // defaultValue={defaultValue || false}
          // disabled={disabled}
          // onChange={formik.handleChange}
          size="small"
          label={normalizeCamelCase(capFirst(name))}
          required={required}
        />
      </FormGroup>
    )

    if (type === 'boolean' || type === 'toggle') {
      let prefillValue = definitions.fields.find(field => field.name === name)?.value

      let uniqueName = name + '-' + counter
      
      formik.values[uniqueName] = defaultValue 
        ? defaultValue
        : prefillValue
          ? prefillValue
            : ''

      return (
        <FormGroup key={'toggle-button-' + name + '-' + uuidv4()}>
          <FormControlLabel
            control={(
              <Switch id={name} color="primary" />
            )}
            disabled={disabled}
            // defaultValue={defaultValue}
            // onChange={formik.handleChange}
            // value={formik.values[uniqueName]}
            size="small"
            label={normalizeCamelCase(capFirst(name))}
          />
        </FormGroup>
    )}

    if (['string', 'number', 'input', 'file',].includes(type)) {

      let prefillValue = definitions.fields.find(field => field.name === name)?.value

      let uniqueName = name + '-' + counter

      console.log('in rendering input field: ', formik)
      
      // formik.values[uniqueName] = defaultValue 
      //   ? defaultValue
      //   : prefillValue
      //     ? prefillValue
      //       : ''
      // formik.setFieldValue(
      //   uniqueName,
      //   defaultValue 
      //     ? defaultValue
      //     : prefillValue
      //       ? prefillValue
      //         : ''
      // )

      return (
        <React.Fragment key={'input-field-' + uniqueName}>
          <InputLabel>
            {normalizeCamelCase(capFirst(name)).replace('_', ' ')}
          </InputLabel>
          {/* <TextField
            id={normalizeCamelCase(capFirst(name)).replace('_', ' ')}
            key={normalizeCamelCase(capFirst(name)).replace('_', ' ')}
            variant="outlined"
            fullWidth
            // name={uniqueName}
            type={type}
            // onChange={formik.handleChange}
          /> */}
          <Field
            // as={({ field, form, ...props }) => <TextField {...field} {...props} />}
            component={TextField}
            // validate={validate}
            name={uniqueName}
            type={type}
            style={{ width: '100%', }}
            size="small"
            // onChange={handleInputChange}
        />
          {/* <Field
            validate={validate}
            name={uniqueName}
            type={type}
          >
          {({
              form: {
                touched,
                errors,
                isSubmitting
              }, 
              field,
              meta
            }) => (
            <>
              <TextField
                id={normalizeCamelCase(capFirst(name)).replace('_', ' ')}
                key={normalizeCamelCase(capFirst(uniqueName)).replace('_', ' ')}
                variant="outlined"
                fullWidth
                name={uniqueName}
                type={type}
                onChange={handleInputChange}
                // onChange={formik.handleChange}
                value={formik.values[uniqueName]}
                // required={required}
                size="small"
                // disabled={isSubmitting || disabled}
                error={errors[field.name] || false}
                // touched={touched[field.name] ? touched[field.name].toString() : 'false'}
                multiline={['description', 'suggestion', 'comments'].includes(name)}
                rows={['description', 'suggestion', 'comments'].includes(name) ? 3 : 1}
                // {...field}
              />
              {touched[field.name] &&
                errors[field.name] && <div className="error">{errors[field.name]}</div>}
            </>
            )}
          </Field> */}
        </React.Fragment>
      )
    }

    if (type === 'array' || type === 'dropdown') {

      let prefillValue = definitions.fields.find(field => field.name === name)?.value

      let uniqueName = name + '-' + counter
      
      formik.values[uniqueName] = defaultValue 
        ? defaultValue
        : prefillValue
          ? prefillValue
            : ''

      return (
        <React.Fragment key={'dropdown-' + uniqueName}>
          <InputLabel>
            {normalizeCamelCase(capFirst(name))}
          </InputLabel>
          <Field validate={validate} name={uniqueName} type={type}>{({ form: { touched, errors, isSubmitting }, field, meta }) => (
            <>
              <Select
                placeholder={name}
                name={uniqueName}
                fullWidth
                sx={{ width: '100%' }}
                // onChange={formik.handleChange}
                // onChange={handleInputChange}
                disabled={disabled}
                defaultValue={defaultValue}
                // value={formik.values[uniqueName]}
                // value={!defaultValue && prefillValue
                //   ? prefillValue
                //   : defaultValue
                //     ? defaultValue
                //     : formik.values[uniqueName]
                //       ? formik.values[uniqueName]
                //       : ''
                // }
                size="small"
                {...field}
              >
                {options.map(option => (
                  <MenuItem key={option.value} value={option.value} sx={{ width: '100%' }}>
                    {option.value}
                  </MenuItem>
                ))}
              </Select>
              {touched[field.name] &&
                errors[field.name] && <div className="error">{errors[field.name]}</div>
              }
            </>
          )}
          </Field>
        </React.Fragment>
      )
    }

    // After the elements have been generated, then apply the prefill values
  })

  const filterData = async () => {
    // this counter counts how many copies of the forms there are on the page ...
    // ... the counter is used to give the newly generated input fields unique names
    setCounter(prevCount => prevCount + 1)

    // Determine if there is also nested data that needs to be generated into elements
    let selectedJson = null
    
    const nestedFields = Object.keys(definitions.fields[0]).includes('label')
      ? definitions.fields
      : false

    if (nestedFields) selectedJson = nestedFields
      .map(({ fields, label }) => ({
        groupLabel: label,
        nestedFields: fields,
      }))
    else selectedJson = definitions.fields
        
    const els = Object.keys(selectedJson[0]).includes('groupLabel')
      ? await Promise
        .all(selectedJson
          .map(async ({ nestedFields }) => await generateElementsFromJson(nestedFields)))
      : await generateElementsFromJson(definitions.fields)

    if (Object.keys(selectedJson[0]).includes('groupLabel')) setElements(els.map(nestedEls => nestedEls.map(el => el?.type && el)))
    else setElements([els.map(el => el?.type && el)])
  }

  async function prefillValues() {
    
    const definitionPrefillKeys = definitions.fields.map(({ prefillDataKey }) => prefillDataKey)
    
    definitionPrefillKeys.forEach(prefillKey => {

      const fieldDefinition = definitions.fields
        .find(({ prefillDataKey }) => prefillDataKey === prefillKey)
      
      if (designPortal[prefillKey]) fieldDefinition.value = designPortal[prefillKey]
      
      else if (designPortal.currentCustomer[0][prefillKey]) fieldDefinition.value = designPortal.currentCustomer[0][prefillKey]
      
      else fieldDefinition.value = ''
    })
  }

  async function handleAddFormSection(nestedElements, sections) {
    setCounter(prevCount => prevCount + 1)

    // if the form(s) submitting is nested in a page with multiple/nested forms
    if (sections) {
      
      // !!! MUST CHANGE THIS TO BE MORE TIGHTLY CONNECTED -- not comparing arrays by length alone !!!
      const selectedDefinitions = definitions.fields.find(({ fields }) => fields.length === nestedElements.length)
      
      const generatedElements = await generateElementsFromJson(selectedDefinitions.fields)

      const definitionIndex = definitions.fields.indexOf(selectedDefinitions)

      definitions.fields.splice(definitionIndex, 0, selectedDefinitions)
      
      // dynamically find the index of the nestedElements inside the rendered elements array
      const index = elements.indexOf(nestedElements)

      // using the index found above manipulate the existing elements array ...
      // ... to push the new elements array at the specific index of the ...
      // ... rendered elements array. 
      elements.splice(index, 0, generatedElements)

      // force a component rerender to register the newly mutated array of elements and field definitions
      dispatch(actions.handleMenu({ key: 'rerender', value: !menus['rerender'] }))

    }
    else {
      hasNestedElements = false

      const generatedElements = await generateElementsFromJson(definitions.fields)
      
      elements.push([generatedElements])

      // force a component rerender to register the newly mutated array of elements and field definitions
      dispatch(actions.handleMenu({ key: 'rerender', value: !menus['rerender'] }))
    }

  }

  // Effects 
  useEffect(() => {
    // Check the available customer data to prefill form values where applicable
    (async () => await prefillValues())()

    // force a component rerender to register the newly mutated array of elements and field definitions
    dispatch(actions.handleMenu({ key: 'rerender', value: !menus['rerender'] }))

  }, [designPortal])

  useEffect(() => {
    // context data is available or the subroute changed or customer selctions changed
    // if for any reason the data in context is lost or disrupted navigate ...
    // ... back to the customer_info subroute to make a new Customer search
    if (!designPortal.currentCustomer || designPortal.currentCustomer.length < 1) navigate('/managed_services/customer_info')

    // Check the available customer data to prefill form values where applicable
    (async () => await prefillValues())()

    // prep the data to generate jsx elements using the definitions passed in the props
    filterData(definitions)

    // // force a component rerender to register the newly mutated array of elements and field definitions
    // dispatch(actions.handleMenu({ key: 'rerender', value: !menus['rerender'] }))

  }, [location.pathname || designPortal.currentCustomer])

  // Force rerender on menus.rerender toggle
  useEffect(() => {}, [menus['rerender']])

  console.log({ formik })
  
  // Return
  return (
    <FormikProvider value={formik}>
    {definitions?.label === 'Add Customer Site' ? ( // if the form rendered is on the modal
      <Grid container component={Form}>
        {elements.map((element, i) => (
          <Grid
            key={'element-grid-item-' + i}
            item
            xs={12}
            md={6}
          >
            <Box sx={{ p: 1, textAlign: 'left' }} children={element} />
          </Grid>
        ))}
        <Grid item sm={12}>
          <Box sx={{ flexDirection: 'row-reverse', gap: '20px' }}>
            <Button sx={{ mx: 1 }} variant="outlined" color="error" children="Cancel" onClick={cancelHandler} />
            <Button sx={{ mx: 1 }} variant="contained" color="primary" children="Save" type="submit" />
          </Box>
        </Grid>
      </Grid>
  ) : hasNestedElements ? (
    <Grid
      container
      spacing={1}
      p={1}
      px={(subRoutePathname === 'report_bug' || subRoutePathname === 'feature_request') ? 8 : 0}
      component={Form}
    >
      <Grid item sm={12}>
        {(elements.length < 1)
          ? null
          : elements.map((element, i) => (
            <Grid key={definitions.fields[i]?.label + '-section-' + uuidv4()} item md={12}>
              {customFormSections.map((sections, sectionIndex) => (
              <OuterContentPaper p={2}>
                <Typography
                  variant="h6"
                  py={1}
                  children={normalizeCamelCase(capFirst(definitions.fields[i]?.label))?.replace('_', ' ')}
                />
                  <Grid container>
                    {element.map((nestedElement, i) => (
                      <Grid
                        key={'dynamically-generated-section-' + uuidv4()}
                        item
                        xs={12}
                        md={'comments' === nestedElement.key.split('-')[0]  ? 12 : 6}
                      >
                        <Box sx={{ p: 1, textAlign: 'left' }} children={nestedElement} />
                      </Grid>
                    ))}
                    {definitions.fields[i]?.addLabel && (
                      <Grid item md={12} sx={{ justifyContent: 'end', p: 1 }}>
                        <ListItemButton onClick={() => handleAddFormSection(element, elements)}>
                          {definitions.fields[i]?.addLabel}
                          <AddIcon />
                        </ListItemButton>
                      </Grid>
                    )}
                  </Grid>
              </OuterContentPaper>
              ))}
            </Grid>
          ))
        }
      </Grid>
      <Grid item sm={12}>
        <Box sx={{
            display: 'flex',
            gap: '10px',
            flex: 'auto',
            // flexDirection: 'row-reverse',
            justifyContent: 'space-between',
            mt: 2,
          }}
        >
          <Box sx={{ flexDirection: 'row' }}>
            <Button variant="contained" color="primary" children="History" onClick={() => navigate('/managed_services/history')}/>
          </Box>
          <Box sx={{ flexDirection: 'row-reverse', gap: '20px' }}>
            <Button sx={{ mx: 1 }} variant="outlined" color="error" children="Cancel" onClick={formik.resetForm} />
            <Button sx={{ mx: 1 }} variant="contained" color="primary" children="Save" type="submit" />
          </Box>
        </Box>
      </Grid>
    </Grid>
  ) : ( // This Subroute does not have nested fields and requires a different UI structure
    <Grid container component={Form}>
      <Grid item sm={12}>
      {elements.map((elementSection, i) => (
        <OuterContentPaper key={'section-' + uuidv4()} p={2}>
          <Typography
            variant="h6"
            py={1}
            children={normalizeCamelCase(capFirst(definitions.fields[i]?.label))?.replace('_', ' ')}
          />
          <Grid container >
            {elementSection.map((element, i) => (
              <Grid
                key={'field-' + i}
                item
                xs={12}
                md={['report_bug', 'feature_request'].includes(params.folder) ? 12 : 6}
              >
                <Box sx={{ p: 1, textAlign: 'left' }} children={element} />
              </Grid>
            ))}
          </Grid>
          {definitions?.addLabel && (
            <Grid item md={12} sx={{ justifyContent: 'end', p: 1 }}>
            <ListItemButton onClick={() => handleAddFormSection(elements)}>
              {definitions?.addLabel}
              <AddIcon />
            </ListItemButton>
            </Grid>
          )}
        </OuterContentPaper>
      ))}
    </Grid>
    <Grid item sm={12}>
      <Box sx={{
          display: 'flex',
          gap: '10px',
          flex: 'auto',
          justifyContent: 'space-between',
          mt: 2,
          p: 2,
        }}
      >
        <Box sx={{ flexDirection: 'row' }}>
          <Button variant="contained" color="primary" children="History" onClick={() => navigate('/managed_services/history')}/>
        </Box>
        <Box sx={{ flexDirection: 'row-reverse', gap: '20px' }}>
          <Button sx={{ mx: 1 }} variant="outlined" color="error" children="Cancel" onClick={formik.resetForm} />
          <Button sx={{ mx: 1 }} variant="contained" color="primary" children="Save" type="submit" />
        </Box>
      </Box>
    </Grid>
  </Grid>
  )}
  </FormikProvider>
  )
};

export default CustomForm;
