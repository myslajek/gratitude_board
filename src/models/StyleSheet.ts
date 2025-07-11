import React from "react";

type CSSProperties = {
  [key:string]: React.CSSProperties;
};

export class StyleSheet {
  static create<Styles extends CSSProperties>(styles: Styles): Styles {
    return styles;
  };
};