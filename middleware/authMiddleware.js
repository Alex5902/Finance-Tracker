import jwt from "jsonwebtoken";

export const main = async (event) => {
  try {
    const authHeader = event.authorizationToken;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("No token provided");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded Token:", decoded);
    return generatePolicy(decoded.id, "Allow", event.methodArn);
  } catch (error) {
    console.error("Authorization failed:", error.message);
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }
};

const generatePolicy = (principalId, effect, resource) => {
  return {
    principalId: String(principalId),
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
    context: {
      userId: principalId, // Pass userId to context
    },
  };
};

