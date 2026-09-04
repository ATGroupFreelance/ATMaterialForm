import React from "react";
import {
    AtFormChildProps,
    AtFormFieldErrorFallback,
    AtFormUnknownChildProps,
} from "../../../../types/AtForm.type";

interface AtFormFieldErrorBoundaryProps {
    children: React.ReactNode;
    childProps: AtFormChildProps | AtFormUnknownChildProps;
    fallback: AtFormFieldErrorFallback;
    resetKey: unknown;
}

interface AtFormFieldErrorBoundaryState {
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

class AtFormFieldErrorBoundary extends React.Component<
    AtFormFieldErrorBoundaryProps,
    AtFormFieldErrorBoundaryState
> {
    state: AtFormFieldErrorBoundaryState = {
        error: null,
        errorInfo: null,
    };

    static getDerivedStateFromError(
        error: Error
    ): Partial<AtFormFieldErrorBoundaryState> {
        return {
            error,
        };
    }

    componentDidCatch(
        _error: Error,
        errorInfo: React.ErrorInfo
    ) {
        this.setState({
            errorInfo,
        });
    }

    componentDidUpdate(
        prevProps: AtFormFieldErrorBoundaryProps
    ) {
        if (
            this.state.error &&
            prevProps.resetKey !== this.props.resetKey
        ) {
            this.setState({
                error: null,
                errorInfo: null,
            });
        }
    }

    render() {
        const { error, errorInfo } = this.state;

        if (error) {
            return this.props.fallback({
                error,
                errorInfo,
                childProps: this.props.childProps,
            });
        }

        return this.props.children;
    }
}

export default AtFormFieldErrorBoundary;