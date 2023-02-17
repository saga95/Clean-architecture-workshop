exports.handler = async (event: any) => {
  console.log("event: ", event);

  try {
  } catch (error: any) {
    const { requestId, cfId, extendedRequestId } = error.$$metadata;
    console.log({ requestId, cfId, extendedRequestId });
  }
};
