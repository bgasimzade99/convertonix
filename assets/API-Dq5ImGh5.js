import{c as h,r as p,j as e,P as v,S as N,Z as f,h as m,k as b,a as g}from"./index-Djuotrda.js";import{G as y}from"./globe-DeFBzDbf.js";/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const t=h("Code",[["polyline",{points:"16 18 22 12 16 6",key:"z7tu5w"}],["polyline",{points:"8 6 2 12 8 18",key:"1eg1df"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P=h("Terminal",[["polyline",{points:"4 17 10 11 4 5",key:"akl6gq"}],["line",{x1:"12",x2:"20",y1:"19",y2:"19",key:"q2wloq"}]]);function C(){const[o,l]=p.useState(""),[a,n]=p.useState("overview"),x=[{method:"POST",endpoint:"/api/v1/convert",description:"Convert a file to another format",parameters:{file:"File to convert (multipart/form-data)",target_format:"Target format (string)",options:"Conversion options (object, optional)"}},{method:"GET",endpoint:"/api/v1/formats",description:"Get list of supported formats",parameters:{category:"Format category (string, optional)"}},{method:"POST",endpoint:"/api/v1/batch",description:"Convert multiple files at once",parameters:{files:"Array of files (multipart/form-data)",target_format:"Target format (string)",options:"Batch conversion options (object, optional)"}}],d={curl:`curl -X POST "https://api.convertonix.com/v1/convert" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@document.pdf" \\
  -F "target_format=docx" \\
  -F "options={\\"quality\\": \\"high\\"}"`,javascript:`const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('target_format', 'docx');
formData.append('options', JSON.stringify({ quality: 'high' }));

const response = await fetch('https://api.convertonix.com/v1/convert', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: formData
});

const result = await response.json();
console.log(result);`,python:`import requests

url = "https://api.convertonix.com/v1/convert"
headers = {"Authorization": "Bearer YOUR_API_KEY"}

files = {"file": open("document.pdf", "rb")}
data = {
    "target_format": "docx",
    "options": '{"quality": "high"}'
}

response = requests.post(url, headers=headers, files=files, data=data)
result = response.json()
print(result)`},j=[{name:"Free Tier",requests:"100/month",price:"$0",features:["Basic file conversions","Standard formats","Community support"]},{name:"Developer",requests:"10,000/month",price:"$29",features:["All file formats","Batch processing","Priority support","Webhooks"]},{name:"Business",requests:"100,000/month",price:"$99",features:["Everything in Developer","Custom integrations","Dedicated support","SLA guarantee"]}],u=(s,i)=>{navigator.clipboard.writeText(s),l(i),setTimeout(()=>l(""),2e3)};return e.jsxs("div",{className:"api-page",children:[e.jsx(v,{}),e.jsx("section",{className:"api-hero",children:e.jsxs("div",{className:"container",children:[e.jsxs("h1",{children:[e.jsx("span",{className:"gradient-text",children:"API Documentation"}),e.jsx("br",{}),"Integrate Convertonix into Your App"]}),e.jsx("p",{className:"hero-subtitle",children:"Powerful REST API for file conversion. Convert files programmatically with our simple, secure, and scalable API."}),e.jsxs("div",{className:"api-badges",children:[e.jsxs("div",{className:"badge",children:[e.jsx(N,{size:20}),e.jsx("span",{children:"Secure"})]}),e.jsxs("div",{className:"badge",children:[e.jsx(f,{size:20}),e.jsx("span",{children:"Fast"})]}),e.jsxs("div",{className:"badge",children:[e.jsx(y,{size:20}),e.jsx("span",{children:"Global"})]})]})]})}),e.jsx("section",{className:"quick-start",children:e.jsxs("div",{className:"container",children:[e.jsx("h2",{className:"section-title",children:"Quick Start"}),e.jsxs("div",{className:"quick-start-content",children:[e.jsxs("div",{className:"steps",children:[e.jsxs("div",{className:"step",children:[e.jsx("div",{className:"step-number",children:"1"}),e.jsxs("div",{className:"step-content",children:[e.jsx("h3",{children:"Get API Key"}),e.jsx("p",{children:"Sign up and get your free API key"})]})]}),e.jsxs("div",{className:"step",children:[e.jsx("div",{className:"step-number",children:"2"}),e.jsxs("div",{className:"step-content",children:[e.jsx("h3",{children:"Make Request"}),e.jsx("p",{children:"Send files to our conversion endpoint"})]})]}),e.jsxs("div",{className:"step",children:[e.jsx("div",{className:"step-number",children:"3"}),e.jsxs("div",{className:"step-content",children:[e.jsx("h3",{children:"Get Results"}),e.jsx("p",{children:"Receive converted files instantly"})]})]})]}),e.jsxs("div",{className:"api-key-section",children:[e.jsx("h3",{children:"Your API Key"}),e.jsxs("div",{className:"api-key-input",children:[e.jsx("input",{type:"text",placeholder:"Enter your API key"}),e.jsx("button",{className:"btn-primary",children:"Get API Key"})]})]})]})]})}),e.jsx("section",{className:"api-endpoints",children:e.jsxs("div",{className:"container",children:[e.jsx("h2",{className:"section-title",children:"API Endpoints"}),e.jsx("div",{className:"endpoints-list",children:x.map((s,i)=>e.jsxs("div",{className:"endpoint-card",children:[e.jsxs("div",{className:"endpoint-header",children:[e.jsx("span",{className:`method ${s.method.toLowerCase()}`,children:s.method}),e.jsx("code",{className:"endpoint-url",children:s.endpoint})]}),e.jsx("p",{className:"endpoint-description",children:s.description}),e.jsxs("div",{className:"endpoint-parameters",children:[e.jsx("h4",{children:"Parameters:"}),e.jsx("ul",{children:Object.entries(s.parameters).map(([r,c])=>e.jsxs("li",{children:[e.jsxs("strong",{children:[r,":"]})," ",c]},r))})]})]},i))})]})}),e.jsx("section",{className:"code-examples",children:e.jsxs("div",{className:"container",children:[e.jsx("h2",{className:"section-title",children:"Code Examples"}),e.jsxs("div",{className:"tabs",children:[e.jsxs("button",{className:`tab ${a==="overview"?"active":""}`,onClick:()=>n("overview"),children:[e.jsx(P,{size:20}),"cURL"]}),e.jsxs("button",{className:`tab ${a==="javascript"?"active":""}`,onClick:()=>n("javascript"),children:[e.jsx(t,{size:20}),"JavaScript"]}),e.jsxs("button",{className:`tab ${a==="python"?"active":""}`,onClick:()=>n("python"),children:[e.jsx(t,{size:20}),"Python"]})]}),e.jsxs("div",{className:"code-block",children:[e.jsxs("div",{className:"code-header",children:[e.jsx("span",{className:"code-language",children:a}),e.jsxs("button",{className:"copy-button",onClick:()=>u(d[a],a),children:[o===a?e.jsx(m,{size:16}):e.jsx(b,{size:16}),o===a?"Copied!":"Copy"]})]}),e.jsx("pre",{className:"code-content",children:e.jsx("code",{children:d[a]})})]})]})}),e.jsx("section",{className:"api-pricing",children:e.jsxs("div",{className:"container",children:[e.jsx("h2",{className:"section-title",children:"API Pricing"}),e.jsx("div",{className:"pricing-grid",children:j.map((s,i)=>e.jsxs("div",{className:`pricing-card ${s.name==="Developer"?"featured":""}`,children:[s.name==="Developer"&&e.jsx("div",{className:"popular-badge",children:"Most Popular"}),e.jsx("h3",{children:s.name}),e.jsxs("div",{className:"price",children:[e.jsx("span",{className:"price-amount",children:s.price}),e.jsx("span",{className:"price-period",children:"/month"})]}),e.jsx("div",{className:"requests",children:s.requests}),e.jsx("ul",{className:"features",children:s.features.map((r,c)=>e.jsxs("li",{children:[e.jsx(m,{size:16}),r]},c))}),e.jsx("button",{className:`btn ${s.name==="Developer"?"btn-primary":"btn-outline"}`,children:s.name==="Free Tier"?"Get Started":"Choose Plan"})]},i))})]})}),e.jsx("section",{className:"response-format",children:e.jsxs("div",{className:"container",children:[e.jsx("h2",{className:"section-title",children:"Response Format"}),e.jsxs("div",{className:"response-example",children:[e.jsx("h3",{children:"Success Response"}),e.jsx("pre",{className:"json-response",children:`{
  "success": true,
  "data": {
    "converted_file": "data:application/pdf;base64,JVBERi0xLjQK...",
    "filename": "converted_document.pdf",
    "size": 1024000,
    "format": "pdf"
  },
  "meta": {
    "processing_time": 1.2,
    "timestamp": "2025-01-27T10:30:00Z"
  }
}`})]}),e.jsxs("div",{className:"response-example",children:[e.jsx("h3",{children:"Error Response"}),e.jsx("pre",{className:"json-response",children:`{
  "success": false,
  "error": {
    "code": "INVALID_FORMAT",
    "message": "Unsupported target format",
    "details": "The requested format 'xyz' is not supported"
  }
}`})]})]})}),e.jsx("section",{className:"sdks",children:e.jsxs("div",{className:"container",children:[e.jsx("h2",{className:"section-title",children:"SDKs & Libraries"}),e.jsxs("div",{className:"sdks-grid",children:[e.jsxs("div",{className:"sdk-card",children:[e.jsx(t,{size:32}),e.jsx("h3",{children:"JavaScript SDK"}),e.jsx("p",{children:"Official JavaScript SDK for Node.js and browsers"}),e.jsx("button",{className:"btn-outline",children:"View on GitHub"})]}),e.jsxs("div",{className:"sdk-card",children:[e.jsx(t,{size:32}),e.jsx("h3",{children:"Python SDK"}),e.jsx("p",{children:"Python library for easy integration"}),e.jsx("button",{className:"btn-outline",children:"View on PyPI"})]}),e.jsxs("div",{className:"sdk-card",children:[e.jsx(t,{size:32}),e.jsx("h3",{children:"PHP SDK"}),e.jsx("p",{children:"PHP library for server-side integration"}),e.jsx("button",{className:"btn-outline",children:"View on Packagist"})]})]})]})}),e.jsx(g,{})]})}export{C as default};
