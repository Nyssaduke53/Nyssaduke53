import{html as a,render as c}from"https://esm.sh/htm/preact";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))l(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const s of t.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&l(s)}).observe(document,{childList:!0,subtree:!0});function o(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function l(e){if(e.ep)return;e.ep=!0;const t=o(e);fetch(e.href,t)}})();async function u(){return(await fetch("/src/data/template-survey.json")).json()}function d({categories:r,currentTheme:n}){return a`<nav>
    <h1 class="text-lg">Categories</h1>
    <ul>
      ${r.map(o=>a`<li><button class="btn" data-cat=${o.id}>${o.name}</button></li>`)}
    </ul>
    <hr />
    <label>
      Theme
      <select value=${n} onInput=${o=>f(o.target.value)}>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
        <!-- more -->
      </select>
    </label>
  </nav>`}let i={template:null,theme:"dark"};(async()=>(i.template=await u(),m()))();function m(){const r=document.getElementById("sidebar");c(a`<${d} categories=${i.template.categories} currentTheme=${i.theme} />`,r)}function f(r){document.documentElement.className=`theme-${r}`,i.theme=r}
