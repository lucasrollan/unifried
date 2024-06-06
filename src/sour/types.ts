import { Dictionary, Slice } from "@reduxjs/toolkit";
import { Component } from "react";

// TODO: All modules should have these things. Ideally, there would be a registerModule function
export interface SourModule {
    ontologies?: string[]; // SHACL documents with data
    renderers?: Dictionary<Component>; // map type string to React component
    slice?: Slice ;
    dependencies?: string[]; // other modules that this module needs to function properly
}
