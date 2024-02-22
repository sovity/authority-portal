export const ok = (body: any): Promise<Response> =>
  new Promise((resolve) => {
    console.log('Fake Backend will return:', body);
    const response = new Response(JSON.stringify(body), {status: 200});
    setTimeout(() => resolve(response), 400);
  });
