// features/clients/utils/clientTransformers.js

// Transform API response to form format (flatten nested objects)
export const transformClientFromApi = (apiClient) => {
  return {
    id: apiClient.id,
    vendor_id: apiClient.vendor_id,
    client_type: apiClient.client_type,
    
    // Personal Details
    first_name: apiClient.first_name || "",
    last_name: apiClient.last_name || "",
    
    // Business Information
    business_name: apiClient.business_name || "",
    business_type: apiClient.business_type || "",
    industry: apiClient.industry || "",
    business_registration_number: apiClient.business_registration_number || "",
    
    // Contact Information
    contact_person_name: apiClient.contact_person_name || "",
    designation: apiClient.designation || "",
    email: apiClient.email || "",
    mobile_number: apiClient.mobile_number || "",
    alternate_mobile_number: apiClient.alternate_mobile_number || "",
    
    // Address - flatten from address object
    address_line_1: apiClient.address?.address_line_1 || "",
    address_line_2: apiClient.address?.address_line_2 || "",
    city: apiClient.address?.city || "",
    state: apiClient.address?.state || "",
    country: apiClient.address?.country || "",
    zip_code: apiClient.address?.zip_code || "",
    
    // Billing - flatten from payment object
    billing_name: apiClient.payment?.billing_name || "",
    payment_term: apiClient.payment?.payment_term || "",
    preferred_currency: apiClient.payment?.preferred_currency?.toLowerCase() || "",
    
    // Tax
    is_tax_applicable: Boolean(apiClient.tax?.is_tax_applicable),
    tax_percentage: apiClient.tax?.tax_percentage?.toString() || "0",
    
    // Additional
    website_url: apiClient.website_url || "",
    logo_url: apiClient.logo?.url || apiClient.logo_path,
    logo_temp_id: null,
    remove_logo: false,
    service_category: apiClient.service_category || "",
    service_sub_category: apiClient.service_sub_category || "",
    notes: apiClient.notes || "",
    status: apiClient.status || "active",
    
    // Availability Schedule - use directly (already in correct format)
    availability_schedule: apiClient.availability_schedule || {
      available_days: [],
      preferred_start_time: "09:00",
      preferred_end_time: "17:00",
      has_lunch_break: false,
      lunch_start: "12:00",
      lunch_end: "13:00",
      notes: "",
    },
    
    // Metadata
    created_at: apiClient.created_at,
    updated_at: apiClient.updated_at,
    created_by: apiClient.created_by,
    updated_by: apiClient.updated_by,
  };
};

// Transform form data to API format (nest related fields)
export const transformClientForApi = (formData) => {
  const apiData = {
    client_type: formData.client_type,
    
    // Personal Details
    ...(formData.client_type === "residential" && {
      first_name: formData.first_name,
      last_name: formData.last_name,
    }),
    
    // Business Information
    ...(formData.client_type === "commercial" && {
      business_name: formData.business_name,
      business_type: formData.business_type,
      industry: formData.industry,
      business_registration_number: formData.business_registration_number,
    }),
    
    // Contact Information (flat fields)
    contact_person_name: formData.contact_person_name,
    designation: formData.designation,
    email: formData.email,
    mobile_number: formData.mobile_number,
    alternate_mobile_number: formData.alternate_mobile_number,
    
    // Address - nest under address object
    address: {
      address_line_1: formData.address_line_1,
      address_line_2: formData.address_line_2,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      zip_code: formData.zip_code,
    },
    
    // Payment - nest under payment object
    payment: {
      payment_term: formData.payment_term,
      preferred_currency: formData.preferred_currency,
      billing_name: formData.billing_name,
    },
    
    // Tax - nest under tax object
    tax: {
      is_tax_applicable: Boolean(formData.is_tax_applicable),
      tax_percentage: Boolean(formData.is_tax_applicable)
        ? parseInt(formData.tax_percentage || 0, 10)
        : 0,
    },
    
    // Additional flat fields
    website_url: formData.website_url,
    service_category: formData.service_category,
    service_sub_category: formData.service_sub_category,
    notes: formData.notes,
  };

  // Handle logo
  if (formData.id) {
    if (formData.remove_logo) {
      apiData.remove_logo = true;
    } else if (formData.logo_temp_id) {
      apiData.logo_temp_id = formData.logo_temp_id;
    }
  } else if (formData.logo_temp_id) {
    apiData.logo_temp_id = formData.logo_temp_id;
  }

  // Add availability schedule
  if (formData.availability_schedule) {
    apiData.availability_schedule = formData.availability_schedule;
  }

  // Remove undefined/null values
  Object.keys(apiData).forEach((key) => {
    if (apiData[key] === undefined || apiData[key] === null) {
      delete apiData[key];
    } else if (typeof apiData[key] === 'object' && !Array.isArray(apiData[key])) {
      // Clean nested objects too
      Object.keys(apiData[key]).forEach((nestedKey) => {
        if (apiData[key][nestedKey] === undefined || apiData[key][nestedKey] === null) {
          delete apiData[key][nestedKey];
        }
      });
      // Remove empty objects
      if (Object.keys(apiData[key]).length === 0) {
        delete apiData[key];
      }
    }
  });

  return apiData;
};