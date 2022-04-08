import React, { Component, ErrorInfo } from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: Boolean;
};

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ hasError: true });
    console.log("ERROR CAUGHT", error, info);
  }

  render() {
    return this.props.children;
  }
}

export default ErrorBoundary;
